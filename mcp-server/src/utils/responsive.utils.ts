// ─── Figma Constraints → Tailwind Responsive Prefixes ───

import type { IRDimensions, IRNode } from '../types/ir.types.js';

/**
 * Standard breakpoints (mobile-first):
 *   sm   → 640px
 *   md   → 768px
 *   lg   → 1024px
 *   xl   → 1280px
 *   2xl  → 1536px
 */

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveOverride {
    breakpoint: Breakpoint;
    classes: string[];
}

/**
 * Analyzes an IR node's dimensions and layout to produce responsive overrides.
 * This uses heuristics based on min/max width constraints and layout direction.
 */
export function generateResponsiveOverrides(node: IRNode): ResponsiveOverride[] {
    const overrides: ResponsiveOverride[] = [];
    const dims = node.dimensions;

    // If node wraps children, stack them on mobile
    if (node.layout.wrap || node.layout.direction === 'horizontal') {
        overrides.push({
            breakpoint: 'md',
            classes: node.layout.direction === 'horizontal' ? ['flex-row'] : [],
        });
        // On mobile, force vertical stacking
        if (node.layout.direction === 'horizontal') {
            // This means the base class should be flex-col, and md: switches to flex-row
            // The caller should handle adding 'flex-col' as a base class
        }
    }

    // Width-based responsive hints
    if (typeof dims.maxWidth === 'number' && dims.maxWidth > 0) {
        if (dims.maxWidth >= 1280) {
            overrides.push({ breakpoint: 'xl', classes: [`max-w-[${dims.maxWidth}px]`] });
        } else if (dims.maxWidth >= 1024) {
            overrides.push({ breakpoint: 'lg', classes: [`max-w-[${dims.maxWidth}px]`] });
        }
    }

    // Full-width on mobile, constrained on larger screens
    if (typeof dims.width === 'number' && dims.width >= 640) {
        overrides.push({ breakpoint: 'sm', classes: ['w-full'] });
        if (dims.width >= 768) {
            overrides.push({ breakpoint: 'md', classes: [`w-[${dims.width}px]`] });
        }
    }

    return overrides;
}

/**
 * Merges base Tailwind classes with responsive overrides into a single class string.
 */
export function mergeWithResponsive(baseClasses: string[], overrides: ResponsiveOverride[]): string {
    const all = [...baseClasses];

    for (const override of overrides) {
        for (const cls of override.classes) {
            all.push(`${override.breakpoint}:${cls}`);
        }
    }

    return all.filter(Boolean).join(' ');
}

/**
 * Determines if a horizontal layout should stack on mobile.
 * Returns whether the component should use flex-col as base + md:flex-row.
 */
export function shouldStackOnMobile(node: IRNode): boolean {
    if (node.layout.direction !== 'horizontal') return false;

    // If the parent contains more than 1 child with significant width, stack on mobile
    if (node.children.length >= 2) return true;

    // If wrap is enabled, let flex-wrap handle it
    if (node.layout.wrap) return false;

    return false;
}

/**
 * Generates mobile-first responsive padding adjustments.
 * Reduces padding on smaller screens for better mobile UX.
 */
export function responsivePadding(basePx: number): string[] {
    if (basePx <= 8) return [];

    const mobile = Math.max(4, Math.round(basePx * 0.5));
    const desktop = basePx;

    const toTw = (px: number) => {
        const scale: Record<number, string> = {
            4: '1', 8: '2', 12: '3', 16: '4', 20: '5', 24: '6', 32: '8', 40: '10', 48: '12',
        };
        const rounded = Math.round(px);
        return scale[rounded] ?? `[${rounded}px]`;
    };

    return [`p-${toTw(mobile)}`, `md:p-${toTw(desktop)}`];
}
