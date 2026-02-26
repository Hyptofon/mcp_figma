// ─── MCP Tool Input Schemas (Zod) ───

import { z } from 'zod';

// ─── fetch_figma_design ───

export const FetchFigmaDesignInputSchema = z.object({
    fileKey: z
        .string()
        .min(1, 'fileKey is required — extract it from the Figma URL: figma.com/design/<fileKey>/...'),
    nodeId: z
        .string()
        .min(1, 'nodeId is required — the Figma node/frame ID, e.g. "12:34"'),
});

export type FetchFigmaDesignInput = z.infer<typeof FetchFigmaDesignInputSchema>;

// ─── generate_component_code ───

export const FrameworkSchema = z.enum(['react', 'vue', 'angular'], {
    errorMap: () => ({ message: 'framework must be one of: "react", "vue", "angular"' }),
});

export type Framework = z.infer<typeof FrameworkSchema>;

export const GenerateComponentCodeInputSchema = z.object({
    designJson: z
        .string()
        .min(1, 'designJson is required — pass the JSON string returned by fetch_figma_design'),
    framework: FrameworkSchema,
    componentName: z
        .string()
        .regex(/^[A-Z][a-zA-Z0-9]*$/, 'componentName must be PascalCase, e.g. "HeroSection"')
        .optional(),
});

export type GenerateComponentCodeInput = z.infer<typeof GenerateComponentCodeInputSchema>;

// ─── generate_astro_page ───

export const HydrationDirectiveSchema = z.enum([
    'client:load',
    'client:visible',
    'client:idle',
    'client:media',
    'client:only',
    'none',
], {
    errorMap: () => ({ message: 'hydration must be one of: "client:load", "client:visible", "client:idle", "client:media", "client:only", "none"' }),
});

export const ChildComponentSchema = z.object({
    name: z.string().min(1, 'Component name required'),
    framework: FrameworkSchema,
    hydration: HydrationDirectiveSchema.default('client:load'),
    code: z.string().min(1, 'Component code required'),
});

export type ChildComponent = z.infer<typeof ChildComponentSchema>;

export const GenerateAstroPageInputSchema = z.object({
    designJson: z
        .string()
        .min(1, 'designJson is required — pass the JSON string returned by fetch_figma_design'),
    pageName: z
        .string()
        .regex(/^[a-z][a-z0-9-]*$/, 'pageName must be kebab-case, e.g. "landing-page"')
        .optional()
        .default('index'),
    childComponents: z.array(ChildComponentSchema).optional().default([]),
    title: z.string().optional().default('Generated Page'),
    description: z.string().optional().default(''),
});

export type GenerateAstroPageInput = z.infer<typeof GenerateAstroPageInputSchema>;

// ─── Helper: format Zod errors into readable MCP error text ───

export function formatZodError(error: z.ZodError): string {
    const lines = error.issues.map((issue) => {
        const path = issue.path.length > 0 ? `"${issue.path.join('.')}"` : '(root)';
        return `  • ${path}: ${issue.message}`;
    });
    return `Invalid input:\n${lines.join('\n')}`;
}
