// ─── MCP Tool: generate_component_code ───

import { ComponentGeneratorService } from '../services/component-generator.service.js';
import { GenerateComponentCodeInputSchema, formatZodError } from '../types/mcp.types.js';
import type { IRDesignTree } from '../types/ir.types.js';
import { ZodError } from 'zod';

const generator = new ComponentGeneratorService();

export function createGenerateComponentCodeHandler() {
    return async (args: Record<string, unknown>) => {
        try {
            const input = GenerateComponentCodeInputSchema.parse(args);

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

            // Generate component code
            const code = generator.generate(
                designTree.rootNode,
                input.framework,
                input.componentName,
            );

            const ext = input.framework === 'vue' ? '.vue' : '.tsx';
            const name = input.componentName ?? toPascalCase(designTree.rootNode.name);

            return {
                content: [
                    {
                        type: 'text' as const,
                        text: `// File: ${name}${ext}\n// Framework: ${input.framework}\n// Generated from Figma design: "${designTree.fileName}"\n\n${code}`,
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
                content: [{ type: 'text' as const, text: `Error generating component: ${message}` }],
                isError: true,
            };
        }
    };
}

function toPascalCase(str: string): string {
    return str
        .replace(/[^a-zA-Z0-9]+/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('');
}
