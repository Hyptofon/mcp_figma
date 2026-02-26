// ─── MCP Tool: fetch_figma_design ───

import type { FigmaApiService } from '../services/figma-api.service.js';
import { FigmaParserService } from '../services/figma-parser.service.js';
import { FetchFigmaDesignInputSchema, formatZodError } from '../types/mcp.types.js';
import { ZodError } from 'zod';

const parser = new FigmaParserService();

export function createFetchFigmaDesignHandler(figmaApi: FigmaApiService) {
    return async (args: Record<string, unknown>) => {
        try {
            // Validate input
            const input = FetchFigmaDesignInputSchema.parse(args);

            // Fetch from Figma API
            const response = await figmaApi.fetchFileNodes(input.fileKey, [input.nodeId]);

            // Parse into IR
            const designTree = parser.parse(response, input.nodeId);

            return {
                content: [
                    {
                        type: 'text' as const,
                        text: JSON.stringify(designTree, null, 2),
                    },
                ],
            };
        } catch (error) {
            if (error instanceof ZodError) {
                return {
                    content: [{ type: 'text' as const, text: formatZodError(error) }],
                    isError: true,
                };
            }
            const message = error instanceof Error ? error.message : String(error);
            return {
                content: [{ type: 'text' as const, text: `Error fetching Figma design: ${message}` }],
                isError: true,
            };
        }
    };
}
