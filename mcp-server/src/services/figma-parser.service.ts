// ─── Figma JSON → IR (Intermediate Representation) Parser ───

import type { FigmaNode, FigmaFileNodesResponse, FigmaEffect, FigmaStroke } from '../types/figma.types.js';
import type {
    IRNode, IRDesignTree, IRComponentType, IRFill, IRBorder,
    IRShadow, IRBorderRadius, IRDimensions, IRTextStyle,
} from '../types/ir.types.js';
import { figmaFillToIR, figmaColorToIR } from '../utils/color.utils.js';
import { parseLayout } from '../utils/layout.utils.js';

export class FigmaParserService {

    /**
     * Parse a full Figma API response into a clean IR design tree.
     */
    parse(response: FigmaFileNodesResponse, nodeId: string): IRDesignTree {
        const nodeData = response.nodes[nodeId];
        if (!nodeData) {
            throw new Error(`Node "${nodeId}" not found in Figma response.`);
        }

        const componentMap: Record<string, string> = {};
        if (nodeData.components) {
            for (const [id, meta] of Object.entries(nodeData.components)) {
                componentMap[id] = meta.name;
            }
        }

        return {
            fileName: response.name,
            lastModified: response.lastModified,
            rootNode: this.parseNode(nodeData.document),
            componentMap,
        };
    }

    /**
     * Recursively parse a FigmaNode into an IRNode.
     */
    private parseNode(node: FigmaNode): IRNode {
        const componentType = this.classifyComponent(node);
        const isInteractive = this.isInteractiveComponent(componentType);

        return {
            id: node.id,
            name: node.name,
            componentType,
            visible: node.visible !== false,

            // Visual
            fills: this.parseFills(node),
            borders: this.parseBorders(node),
            shadows: this.parseShadows(node),
            borderRadius: this.parseBorderRadius(node),
            opacity: node.opacity ?? 1,
            clipContent: node.clipsContent ?? false,

            // Layout
            layout: parseLayout(node),
            dimensions: this.parseDimensions(node),

            // Text
            textContent: node.characters,
            textStyle: node.style ? this.parseTextStyle(node) : undefined,

            // Interactivity
            isInteractive,
            interactivityHint: this.getInteractivityHint(componentType),

            // Children
            children: (node.children ?? [])
                .filter((child) => child.visible !== false)
                .map((child) => this.parseNode(child)),
        };
    }

    // ─── Component classification (heuristic name matching) ───

    private classifyComponent(node: FigmaNode): IRComponentType {
        const name = node.name.toLowerCase();
        const type = node.type;

        // Text nodes
        if (type === 'TEXT') return 'text';

        // Image-like nodes
        if (type === 'RECTANGLE' && node.fills?.some((f) => f.type === 'IMAGE')) return 'image';
        if (type === 'ELLIPSE' && name.includes('avatar')) return 'avatar';

        // Vector / decorative
        if (type === 'VECTOR' || type === 'STAR' || type === 'LINE' || type === 'ELLIPSE' || type === 'REGULAR_POLYGON') {
            if (name.includes('icon')) return 'icon';
            if (name.includes('divider') || name.includes('separator') || type === 'LINE') return 'divider';
            return 'icon';
        }

        // Name-based matching (most reliable for designed components)
        if (name.includes('button') || name.includes('btn') || name.includes('cta')) return 'button';
        if (name.includes('input') || name.includes('text field') || name.includes('textfield')) return 'input';
        if (name.includes('textarea') || name.includes('text area')) return 'textarea';
        if (name.includes('select') || name.includes('dropdown') || name.includes('combobox')) return 'select';
        if (name.includes('checkbox') || name.includes('check box')) return 'checkbox';
        if (name.includes('radio')) return 'radio';
        if (name.includes('switch') || name.includes('toggle')) return 'switch';
        if (name.includes('card')) return 'card';
        if (name.includes('dialog') || name.includes('modal') || name.includes('popup')) return 'dialog';
        if (name.includes('avatar') || name.includes('profile pic')) return 'avatar';
        if (name.includes('badge') || name.includes('tag') || name.includes('chip')) return 'badge';
        if (name.includes('alert') || name.includes('toast') || name.includes('notification')) return 'alert';
        if (name.includes('tooltip')) return 'tooltip';
        if (name.includes('tab')) return 'tabs';
        if (name.includes('accordion') || name.includes('collapsible') || name.includes('expand')) return 'accordion';
        if (name.includes('table')) return 'table';
        if (name.includes('nav') || name.includes('header') || name.includes('topbar') || name.includes('appbar')) return 'navbar';
        if (name.includes('sidebar') || name.includes('drawer') || name.includes('sidenav')) return 'sidebar';
        if (name.includes('footer')) return 'footer';
        if (name.includes('hero') || name.includes('banner') || name.includes('jumbotron')) return 'hero';
        if (name.includes('link') || name.includes('anchor')) return 'link';
        if (name.includes('label') || name.includes('caption')) return 'label';
        if (name.includes('image') || name.includes('img') || name.includes('photo') || name.includes('thumbnail')) return 'image';
        if (name.includes('divider') || name.includes('separator') || name.includes('hr')) return 'divider';

        // Container types (frames, groups, sections)
        if (type === 'FRAME' || type === 'GROUP' || type === 'SECTION' || type === 'COMPONENT' || type === 'INSTANCE') {
            return 'container';
        }

        return 'unknown';
    }

    private isInteractiveComponent(type: IRComponentType): boolean {
        const interactive: IRComponentType[] = [
            'button', 'input', 'textarea', 'select', 'checkbox',
            'radio', 'switch', 'dialog', 'dropdown', 'tabs',
            'accordion', 'link', 'tooltip', 'navbar', 'sidebar',
        ];
        return interactive.includes(type);
    }

    private getInteractivityHint(type: IRComponentType): IRNode['interactivityHint'] {
        switch (type) {
            case 'button':
            case 'link':
            case 'card':
                return 'click';
            case 'input':
            case 'textarea':
            case 'select':
                return 'input';
            case 'checkbox':
            case 'radio':
            case 'switch':
                return 'toggle';
            case 'navbar':
            case 'sidebar':
            case 'tabs':
                return 'navigation';
            default:
                return undefined;
        }
    }

    // ─── Style parsing ───

    private parseFills(node: FigmaNode): IRFill[] {
        return (node.fills ?? [])
            .map(figmaFillToIR)
            .filter((f): f is IRFill => f !== null);
    }

    private parseBorders(node: FigmaNode): IRBorder[] {
        return (node.strokes ?? [])
            .filter((s: FigmaStroke) => s.visible !== false && s.color)
            .map((s: FigmaStroke) => ({
                color: figmaColorToIR(s.color!),
                width: node.strokeWeight ?? 1,
                style: 'solid' as const,
            }));
    }

    private parseShadows(node: FigmaNode): IRShadow[] {
        return (node.effects ?? [])
            .filter((e: FigmaEffect) => e.visible && (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW'))
            .map((e: FigmaEffect) => ({
                type: e.type === 'DROP_SHADOW' ? 'drop' as const : 'inner' as const,
                color: e.color ? figmaColorToIR(e.color) : { r: 0, g: 0, b: 0, a: 0.25, hex: '#000000' },
                offsetX: e.offset?.x ?? 0,
                offsetY: e.offset?.y ?? 0,
                blur: e.radius,
                spread: e.spread ?? 0,
            }));
    }

    private parseBorderRadius(node: FigmaNode): IRBorderRadius {
        if (node.rectangleCornerRadii) {
            return {
                topLeft: node.rectangleCornerRadii[0],
                topRight: node.rectangleCornerRadii[1],
                bottomRight: node.rectangleCornerRadii[2],
                bottomLeft: node.rectangleCornerRadii[3],
            };
        }
        const r = node.cornerRadius ?? 0;
        return { topLeft: r, topRight: r, bottomRight: r, bottomLeft: r };
    }

    private parseDimensions(node: FigmaNode): IRDimensions {
        const width: IRDimensions['width'] =
            node.layoutSizingHorizontal === 'FILL' ? 'fill'
                : node.layoutSizingHorizontal === 'HUG' ? 'auto'
                    : node.absoluteBoundingBox?.width ?? 0;

        const height: IRDimensions['height'] =
            node.layoutSizingVertical === 'FILL' ? 'fill'
                : node.layoutSizingVertical === 'HUG' ? 'auto'
                    : node.absoluteBoundingBox?.height ?? 0;

        return {
            width,
            height,
            minWidth: node.minWidth,
            maxWidth: node.maxWidth,
            minHeight: node.minHeight,
            maxHeight: node.maxHeight,
        };
    }

    private parseTextStyle(node: FigmaNode): IRTextStyle | undefined {
        const s = node.style;
        if (!s) return undefined;

        return {
            fontFamily: s.fontFamily,
            fontWeight: s.fontWeight,
            fontSize: s.fontSize,
            lineHeight: s.lineHeightPx,
            letterSpacing: s.letterSpacing,
            textAlign: s.textAlignHorizontal?.toLowerCase() as IRTextStyle['textAlign'] ?? 'left',
            textTransform: this.mapTextCase(s.textCase),
            textDecoration: this.mapTextDecoration(s.textDecoration),
            italic: s.italic ?? false,
        };
    }

    private mapTextCase(tc?: string): IRTextStyle['textTransform'] {
        switch (tc) {
            case 'UPPER': return 'uppercase';
            case 'LOWER': return 'lowercase';
            case 'TITLE': return 'capitalize';
            default: return 'none';
        }
    }

    private mapTextDecoration(td?: string): IRTextStyle['textDecoration'] {
        switch (td) {
            case 'UNDERLINE': return 'underline';
            case 'STRIKETHROUGH': return 'line-through';
            default: return 'none';
        }
    }
}
