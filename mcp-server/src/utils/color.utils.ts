// ─── Figma Color → Tailwind Class Conversion ───

import type { FigmaColor, FigmaFill } from '../types/figma.types.js';
import type { IRColor, IRFill, IRGradientStop } from '../types/ir.types.js';

// ─── Tailwind color palette (approximate mapping) ───
const TAILWIND_COLORS: Record<string, string> = {
    'ffffff': 'white',
    '000000': 'black',
    'f8fafc': 'slate-50', 'f1f5f9': 'slate-100', 'e2e8f0': 'slate-200',
    'cbd5e1': 'slate-300', '94a3b8': 'slate-400', '64748b': 'slate-500',
    '475569': 'slate-600', '334155': 'slate-700', '1e293b': 'slate-800',
    '0f172a': 'slate-900', '020617': 'slate-950',
    'f9fafb': 'gray-50', 'f3f4f6': 'gray-100', 'e5e7eb': 'gray-200',
    'd1d5db': 'gray-300', '9ca3af': 'gray-400', '6b7280': 'gray-500',
    '4b5563': 'gray-600', '374151': 'gray-700', '1f2937': 'gray-800',
    '111827': 'gray-900', '030712': 'gray-950',
    'fafafa': 'neutral-50', 'f5f5f5': 'neutral-100', 'e5e5e5': 'neutral-200',
    'd4d4d4': 'neutral-300', 'a3a3a3': 'neutral-400', '737373': 'neutral-500',
    '525252': 'neutral-600', '404040': 'neutral-700', '262626': 'neutral-800',
    '171717': 'neutral-900', '0a0a0a': 'neutral-950',
    'fef2f2': 'red-50', 'fee2e2': 'red-100', 'fecaca': 'red-200',
    'fca5a5': 'red-300', 'f87171': 'red-400', 'ef4444': 'red-500',
    'dc2626': 'red-600', 'b91c1c': 'red-700', '991b1b': 'red-800',
    '7f1d1d': 'red-900', '450a0a': 'red-950',
    'eff6ff': 'blue-50', 'dbeafe': 'blue-100', 'bfdbfe': 'blue-200',
    '93c5fd': 'blue-300', '60a5fa': 'blue-400', '3b82f6': 'blue-500',
    '2563eb': 'blue-600', '1d4ed8': 'blue-700', '1e40af': 'blue-800',
    '1e3a8a': 'blue-900', '172554': 'blue-950',
    'f0fdf4': 'green-50', 'dcfce7': 'green-100', 'bbf7d0': 'green-200',
    '86efac': 'green-300', '4ade80': 'green-400', '22c55e': 'green-500',
    '16a34a': 'green-600', '15803d': 'green-700', '166534': 'green-800',
    '14532d': 'green-900', '052e16': 'green-950',
    'fefce8': 'yellow-50', 'fef9c3': 'yellow-100', 'fef08a': 'yellow-200',
    'fde047': 'yellow-300', 'facc15': 'yellow-400', 'eab308': 'yellow-500',
    'ca8a04': 'yellow-600', 'a16207': 'yellow-700', '854d0e': 'yellow-800',
    '713f12': 'yellow-900', '422006': 'yellow-950',
    'faf5ff': 'purple-50', 'f3e8ff': 'purple-100', 'e9d5ff': 'purple-200',
    'd8b4fe': 'purple-300', 'c084fc': 'purple-400', 'a855f7': 'purple-500',
    '9333ea': 'purple-600', '7e22ce': 'purple-700', '6b21a8': 'purple-800',
    '581c87': 'purple-900', '3b0764': 'purple-950',
};

/** Convert Figma RGBA (0–1 range) to IRColor with hex string */
export function figmaColorToIR(color: FigmaColor): IRColor {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    return { r, g, b, a: color.a, hex };
}

/** Convert IRColor to the best matching Tailwind color class */
export function irColorToTailwind(color: IRColor, prefix: 'bg' | 'text' | 'border' | 'from' | 'to' | 'via' = 'bg'): string {
    const hexClean = color.hex.replace('#', '').toLowerCase();

    // Exact match
    if (TAILWIND_COLORS[hexClean]) {
        return `${prefix}-${TAILWIND_COLORS[hexClean]}`;
    }

    // Find closest match by Euclidean distance in RGB space
    let closest = '';
    let minDist = Infinity;

    for (const [hex, name] of Object.entries(TAILWIND_COLORS)) {
        const r2 = parseInt(hex.substring(0, 2), 16);
        const g2 = parseInt(hex.substring(2, 4), 16);
        const b2 = parseInt(hex.substring(4, 6), 16);
        const dist = Math.sqrt(
            (color.r - r2) ** 2 + (color.g - g2) ** 2 + (color.b - b2) ** 2,
        );
        if (dist < minDist) {
            minDist = dist;
            closest = name;
        }
    }

    // If close enough (threshold ~20), use the named class
    if (minDist < 20) {
        const cls = `${prefix}-${closest}`;
        return color.a < 1 ? `${cls}/${Math.round(color.a * 100)}` : cls;
    }

    // Otherwise, use arbitrary value
    const opacity = color.a < 1 ? `/${Math.round(color.a * 100)}` : '';
    return `${prefix}-[${color.hex}]${opacity}`;
}

/** Convert a Figma fill to an IR fill */
export function figmaFillToIR(fill: FigmaFill): IRFill | null {
    if (fill.visible === false) return null;

    switch (fill.type) {
        case 'SOLID':
            return fill.color
                ? { type: 'solid', color: figmaColorToIR(fill.color) }
                : null;

        case 'GRADIENT_LINEAR':
        case 'GRADIENT_RADIAL':
            return {
                type: fill.type === 'GRADIENT_LINEAR' ? 'gradient-linear' : 'gradient-radial',
                gradientStops: fill.gradientStops?.map((stop): IRGradientStop => ({
                    position: stop.position,
                    color: figmaColorToIR(stop.color),
                })),
            };

        case 'IMAGE':
            return { type: 'image', imageRef: fill.imageRef };

        default:
            return null;
    }
}

/** Generate Tailwind background classes from IR fills */
export function fillsToTailwindClasses(fills: IRFill[], tokenMap?: Map<string, string>): string[] {
    const classes: string[] = [];

    for (const fill of fills) {
        if (fill.type === 'solid' && fill.color) {
            if (tokenMap) {
                classes.push(irColorToCssVar(fill.color, tokenMap, 'bg'));
            } else {
                classes.push(irColorToTailwind(fill.color, 'bg'));
            }
        } else if (fill.type === 'gradient-linear' && fill.gradientStops?.length) {
            // Gradients: use Tailwind gradient classes (CSS vars for stops)
            if (tokenMap) {
                const from = irColorToCssVar(fill.gradientStops[0].color, tokenMap, 'from');
                const to = irColorToCssVar(fill.gradientStops[fill.gradientStops.length - 1].color, tokenMap, 'to');
                classes.push('bg-gradient-to-r', from, to);
                if (fill.gradientStops.length > 2) {
                    const via = irColorToCssVar(fill.gradientStops[1].color, tokenMap, 'via');
                    classes.push(via);
                }
            } else {
                const from = irColorToTailwind(fill.gradientStops[0].color, 'from');
                const to = irColorToTailwind(fill.gradientStops[fill.gradientStops.length - 1].color, 'to');
                classes.push('bg-gradient-to-r', from, to);
                if (fill.gradientStops.length > 2) {
                    const via = irColorToTailwind(fill.gradientStops[1].color, 'via');
                    classes.push(via);
                }
            }
        }
    }

    return classes;
}

// ─── CSS Variable-based color functions ───

/**
 * Convert IRColor to a Tailwind class that uses a CSS variable from the token map.
 * Falls back to irColorToTailwind if no match in the token map.
 */
export function irColorToCssVar(
    color: IRColor,
    tokenMap: Map<string, string>,
    prefix: 'bg' | 'text' | 'border' | 'from' | 'to' | 'via' = 'bg',
): string {
    const hexClean = color.hex.replace('#', '').toLowerCase();
    const varName = tokenMap.get(hexClean);

    if (varName) {
        const opacity = color.a < 1 ? `/${Math.round(color.a * 100)}` : '';
        return `${prefix}-[var(${varName})]${opacity}`;
    }

    // Fallback: no token found, use standard Tailwind conversion
    return irColorToTailwind(color, prefix);
}

