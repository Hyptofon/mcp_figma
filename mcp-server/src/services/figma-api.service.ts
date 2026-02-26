// ─── Figma REST API Client ───
// Uses Dependency Injection for the token and in-memory caching.

import type { FigmaFileNodesResponse } from '../types/figma.types.js';

export interface FigmaApiConfig {
    accessToken: string;
    baseUrl?: string;
    cacheTtlMs?: number;
}

interface CacheEntry {
    data: FigmaFileNodesResponse;
    timestamp: number;
}

export class FigmaApiService {
    private readonly token: string;
    private readonly baseUrl: string;
    private readonly cacheTtlMs: number;
    private readonly cache = new Map<string, CacheEntry>();

    constructor(config: FigmaApiConfig) {
        this.token = config.accessToken;
        this.baseUrl = config.baseUrl ?? 'https://api.figma.com/v1';
        this.cacheTtlMs = config.cacheTtlMs ?? 5 * 60 * 1000; // 5 minutes default
    }

    /**
     * Fetch specific nodes from a Figma file.
     * Results are cached in-memory by cacheKey = `${fileKey}:${nodeIds.join(',')}`.
     */
    async fetchFileNodes(fileKey: string, nodeIds: string[]): Promise<FigmaFileNodesResponse> {
        const cacheKey = `${fileKey}:${nodeIds.join(',')}`;
        const cached = this.cache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < this.cacheTtlMs) {
            return cached.data;
        }

        const idsParam = nodeIds.map((id) => encodeURIComponent(id)).join(',');
        const url = `${this.baseUrl}/files/${fileKey}/nodes?ids=${idsParam}`;

        const response = await fetch(url, {
            headers: {
                'X-Figma-Token': this.token,
            },
        });

        if (!response.ok) {
            const body = await response.text();
            switch (response.status) {
                case 401:
                    throw new FigmaApiError(
                        'Authentication failed. Check your FIGMA_PERSONAL_ACCESS_TOKEN.',
                        401,
                    );
                case 403:
                    throw new FigmaApiError(
                        `Access denied to file "${fileKey}". Ensure the token has access to this file.`,
                        403,
                    );
                case 404:
                    throw new FigmaApiError(
                        `File "${fileKey}" or node(s) "${nodeIds.join(', ')}" not found. Double-check the file key and node IDs.`,
                        404,
                    );
                case 429:
                    throw new FigmaApiError(
                        'Figma API rate limit exceeded. Please wait a moment and try again.',
                        429,
                    );
                default:
                    throw new FigmaApiError(
                        `Figma API returned ${response.status}: ${body}`,
                        response.status,
                    );
            }
        }

        const data = (await response.json()) as FigmaFileNodesResponse;

        // Validate that requested nodes exist in response
        for (const nodeId of nodeIds) {
            if (!data.nodes[nodeId]) {
                throw new FigmaApiError(
                    `Node "${nodeId}" was not found in the response. The node may have been deleted or the ID is incorrect.`,
                    404,
                );
            }
        }

        // Store in cache
        this.cache.set(cacheKey, { data, timestamp: Date.now() });

        return data;
    }

    /**
     * Export nodes as images via Figma Images API.
     * Returns a map of nodeId → CDN download URL.
     */
    async exportImages(
        fileKey: string,
        nodeIds: string[],
        format: 'png' | 'svg' | 'jpg' = 'png',
        scale: number = 2,
    ): Promise<Record<string, string>> {
        if (nodeIds.length === 0) return {};

        const result: Record<string, string> = {};

        // Figma API batches — max ~100 per request
        const batchSize = 80;
        for (let i = 0; i < nodeIds.length; i += batchSize) {
            const batch = nodeIds.slice(i, i + batchSize);
            const idsParam = batch.map((id) => encodeURIComponent(id)).join(',');
            const url = `${this.baseUrl}/images/${fileKey}?ids=${idsParam}&format=${format}&scale=${scale}`;

            const response = await fetch(url, {
                headers: { 'X-Figma-Token': this.token },
            });

            if (!response.ok) {
                const body = await response.text();
                throw new FigmaApiError(
                    `Image export failed (${response.status}): ${body}`,
                    response.status,
                );
            }

            const data = (await response.json()) as { images: Record<string, string | null> };

            for (const [nodeId, imageUrl] of Object.entries(data.images)) {
                if (imageUrl) {
                    result[nodeId] = imageUrl;
                }
            }
        }

        return result;
    }

    /** Clear the entire cache */
    clearCache(): void {
        this.cache.clear();
    }
}

export class FigmaApiError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
    ) {
        super(message);
        this.name = 'FigmaApiError';
    }
}
