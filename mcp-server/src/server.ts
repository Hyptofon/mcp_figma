// ─── MCP Server Setup ───
// Registers all tools and wires up services with Dependency Injection.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { FigmaApiService } from './services/figma-api.service.js';
import { createFetchFigmaDesignHandler } from './tools/fetch-figma-design.js';
import { createGenerateComponentCodeHandler } from './tools/generate-component-code.js';
import { createGenerateAstroPageHandler } from './tools/generate-astro-page.js';
import { z } from 'zod';

export function createServer(): McpServer {
    // ─── Dependency Injection: read token from env, pass via constructor ───
    const token = process.env.FIGMA_PERSONAL_ACCESS_TOKEN;
    if (!token) {
        console.error(
            '⚠️  FIGMA_PERSONAL_ACCESS_TOKEN is not set.\n' +
            '   Set it as an environment variable before starting the server.\n' +
            '   The fetch_figma_design tool will fail without it.',
        );
    }

    const figmaApi = new FigmaApiService({
        accessToken: token ?? '',
        cacheTtlMs: 5 * 60 * 1000, // 5 minute cache
    });

    // ─── Create MCP Server ───
    const server = new McpServer({
        name: 'figma-to-code',
        version: '1.0.0',
    });

    // ─── Register Tools ───

    server.tool(
        'fetch_figma_design',
        'Fetch a design node from Figma and return its structured JSON representation (IR). ' +
        'Accepts a Figma file key and node ID. Returns cleaned design data that can be ' +
        'passed to generate_component_code or generate_astro_page.',
        {
            fileKey: z.string().describe('Figma file key from the URL: figma.com/design/<fileKey>/...'),
            nodeId: z.string().describe('The Figma node/frame ID, e.g. "12:34" or "0-1"'),
        },
        createFetchFigmaDesignHandler(figmaApi),
    );

    server.tool(
        'generate_component_code',
        'Generate a production-ready UI component from Figma design JSON. ' +
        'Supports React (shadcn/ui), Vue (shadcn-vue), and Angular (spartan-ui). ' +
        'Uses Tailwind CSS with mobile-first responsive design.',
        {
            designJson: z.string().describe('The JSON string returned by fetch_figma_design'),
            framework: z.enum(['react', 'vue', 'angular']).describe('Target framework'),
            componentName: z.string().optional().describe('PascalCase component name, e.g. "HeroSection"'),
        },
        createGenerateComponentCodeHandler(),
    );

    server.tool(
        'generate_astro_page',
        'Generate an Astro page (.astro file) that composes generated UI components. ' +
        'Handles imports, hydration directives (client:load, client:visible, etc.), ' +
        'and responsive layout. Follows Astro Islands architecture.',
        {
            designJson: z.string().describe('The JSON string returned by fetch_figma_design'),
            pageName: z.string().optional().describe('Kebab-case page name, e.g. "landing-page"'),
            childComponents: z.array(z.object({
                name: z.string().describe('Component name'),
                framework: z.enum(['react', 'vue', 'angular']).describe('Component framework'),
                hydration: z.enum(['client:load', 'client:visible', 'client:idle', 'client:media', 'client:only', 'none'])
                    .default('client:load')
                    .describe('Astro hydration directive'),
                code: z.string().describe('Generated component code'),
            })).optional().describe('Child components to include in the page'),
            title: z.string().optional().describe('Page title for SEO'),
            description: z.string().optional().describe('Meta description for SEO'),
        },
        createGenerateAstroPageHandler(),
    );

    return server;
}
