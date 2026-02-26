// ─── Figma Auto Layout → Tailwind Layout Classes ───

import type { FigmaNode } from '../types/figma.types.js';
import type { IRLayout, IRSpacing, IRAlignItems, IRJustifyContent, IRLayoutDirection } from '../types/ir.types.js';

/** Parse Figma Auto Layout props into a clean IR layout object */
export function parseLayout(node: FigmaNode): IRLayout {
    const direction: IRLayoutDirection =
        node.layoutMode === 'HORIZONTAL' ? 'horizontal'
            : node.layoutMode === 'VERTICAL' ? 'vertical'
                : 'none';

    const alignItems: IRAlignItems = mapCounterAxisAlign(node.counterAxisAlignItems);
    const justifyContent: IRJustifyContent = mapPrimaryAxisAlign(node.primaryAxisAlignItems);

    const padding: IRSpacing = {
        top: node.paddingTop ?? 0,
        right: node.paddingRight ?? 0,
        bottom: node.paddingBottom ?? 0,
        left: node.paddingLeft ?? 0,
    };

    return {
        direction,
        alignItems,
        justifyContent,
        gap: node.itemSpacing ?? 0,
        padding,
        wrap: node.layoutWrap === 'WRAP',
    };
}

function mapCounterAxisAlign(value?: string): IRAlignItems {
    switch (value) {
        case 'MIN': return 'start';
        case 'CENTER': return 'center';
        case 'MAX': return 'end';
        case 'BASELINE': return 'baseline';
        default: return 'start';
    }
}

function mapPrimaryAxisAlign(value?: string): IRJustifyContent {
    switch (value) {
        case 'MIN': return 'start';
        case 'CENTER': return 'center';
        case 'MAX': return 'end';
        case 'SPACE_BETWEEN': return 'between';
        default: return 'start';
    }
}

// ─── Tailwind class generation from IR layout ───

/** Convert IRLayout to an array of Tailwind utility classes */
export function layoutToTailwindClasses(layout: IRLayout): string[] {
    const classes: string[] = [];

    if (layout.direction === 'none') return classes;

    // Flex direction
    classes.push('flex');
    if (layout.direction === 'vertical') classes.push('flex-col');
    if (layout.wrap) classes.push('flex-wrap');

    // Alignment
    const alignMap: Record<IRAlignItems, string> = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
        baseline: 'items-baseline',
    };
    classes.push(alignMap[layout.alignItems]);

    // Justify content
    const justifyMap: Record<IRJustifyContent, string> = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
    };
    classes.push(justifyMap[layout.justifyContent]);

    // Gap
    if (layout.gap > 0) {
        classes.push(`gap-${spacingToTailwind(layout.gap)}`);
    }

    // Padding
    const { top, right, bottom, left } = layout.padding;
    if (top === right && right === bottom && bottom === left && top > 0) {
        classes.push(`p-${spacingToTailwind(top)}`);
    } else {
        if (top === bottom && top > 0 && left === right && left > 0) {
            classes.push(`px-${spacingToTailwind(left)}`, `py-${spacingToTailwind(top)}`);
        } else {
            if (top > 0) classes.push(`pt-${spacingToTailwind(top)}`);
            if (right > 0) classes.push(`pr-${spacingToTailwind(right)}`);
            if (bottom > 0) classes.push(`pb-${spacingToTailwind(bottom)}`);
            if (left > 0) classes.push(`pl-${spacingToTailwind(left)}`);
        }
    }

    return classes;
}

/** Convert px value to Tailwind spacing scale. Fallback to arbitrary value. */
export function spacingToTailwind(px: number): string {
    const scale: Record<number, string> = {
        0: '0', 1: 'px', 2: '0.5', 4: '1', 6: '1.5', 8: '2', 10: '2.5',
        12: '3', 14: '3.5', 16: '4', 20: '5', 24: '6', 28: '7', 32: '8',
        36: '9', 40: '10', 44: '11', 48: '12', 56: '14', 64: '16',
        80: '20', 96: '24', 112: '28', 128: '32', 144: '36', 160: '40',
        176: '44', 192: '48', 208: '52', 224: '56', 240: '60', 256: '64',
        288: '72', 320: '80', 384: '96',
    };

    const rounded = Math.round(px);
    return scale[rounded] ?? `[${rounded}px]`;
}

/** Convert FigmaNode dimensions to Tailwind width/height classes */
export function dimensionsToTailwindClasses(node: FigmaNode): string[] {
    const classes: string[] = [];

    // Width
    if (node.layoutSizingHorizontal === 'FILL') {
        classes.push('w-full');
    } else if (node.layoutSizingHorizontal === 'HUG') {
        classes.push('w-fit');
    } else if (node.absoluteBoundingBox) {
        const w = Math.round(node.absoluteBoundingBox.width);
        classes.push(`w-[${w}px]`);
    }

    // Height
    if (node.layoutSizingVertical === 'FILL') {
        classes.push('h-full');
    } else if (node.layoutSizingVertical === 'HUG') {
        classes.push('h-fit');
    } else if (node.absoluteBoundingBox) {
        const h = Math.round(node.absoluteBoundingBox.height);
        classes.push(`h-[${h}px]`);
    }

    // Min/Max constraints
    if (node.minWidth) classes.push(`min-w-[${Math.round(node.minWidth)}px]`);
    if (node.maxWidth) classes.push(`max-w-[${Math.round(node.maxWidth)}px]`);
    if (node.minHeight) classes.push(`min-h-[${Math.round(node.minHeight)}px]`);
    if (node.maxHeight) classes.push(`max-h-[${Math.round(node.maxHeight)}px]`);

    return classes;
}
