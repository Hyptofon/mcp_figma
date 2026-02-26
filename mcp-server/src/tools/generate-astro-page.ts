// ─── MCP Tool: generate_astro_page ───

import { AstroPageGeneratorService } from '../services/astro-page-generator.service.js';
import { GenerateAstroPageInputSchema, formatZodError } from '../types/mcp.types.js';
import type { IRDesignTree } from '../types/ir.types.js';
import { ZodError } from 'zod';

const pageGenerator = new AstroPageGeneratorService();

export function createGenerateAstroPageHandler() {
    return async (args: Record<string, unknown>) => {
        try {
            const input = GenerateAstroPageInputSchema.parse(args);

            // Parse the design JSON
            let designTree: IRDesignTree;
            try {
                designTree = JSON.parse(input.designJson) as IRDesignTree;
            } catch {
                return {
                    content: [{
                        type: 'text' as const,
                        text: 'Invalid designJson: could not parse as JSON. Pass the exact JSON string returned by fetch_figma_design.',
                    }],
                    isError: true,
                };
            }

            if (!designTree.rootNode) {
                return {
                    content: [{
                        type: 'text' as const,
                        text: 'Invalid designJson: missing "rootNode". Ensure you pass the full output from fetch_figma_design.',
                    }],
                    isError: true,
                };
            }

            // Generate Astro page
            const code = pageGenerator.generate(
                designTree,
                input.pageName,
                input.childComponents,
                input.title,
                input.description,
            );

            return {
                content: [
                    {
                        type: 'text' as const,
                        text: `<!-- File: src/pages/${input.pageName}.astro -->\n<!-- Generated from Figma design: "${designTree.fileName}" -->\n\n${code}`,
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
                content: [{ type: 'text' as const, text: `Error generating Astro page: ${message}` }],
                isError: true,
            };
        }
    };
}
