// ─── IR → Framework Component Code Generator ───

import type { IRNode, IRComponentType, IRTextStyle } from '../types/ir.types.js';
import type { Framework } from '../types/mcp.types.js';
import { getShadcnReactMapping, getAllShadcnReactImports, type ShadcnMapping } from '../mappers/shadcn-react.mapper.js';
import { getShadcnVueMapping, getAllShadcnVueImports } from '../mappers/shadcn-vue.mapper.js';
import { getSpartanMapping, getAllSpartanImports } from '../mappers/spartan-angular.mapper.js';
import { layoutToTailwindClasses, spacingToTailwind } from '../utils/layout.utils.js';
import { fillsToTailwindClasses, irColorToTailwind } from '../utils/color.utils.js';
import { generateResponsiveOverrides, mergeWithResponsive, shouldStackOnMobile } from '../utils/responsive.utils.js';

export class ComponentGeneratorService {

    generate(rootNode: IRNode, framework: Framework, componentName?: string): string {
        const name = componentName ?? this.toPascalCase(rootNode.name);

        switch (framework) {
            case 'react':
                return this.generateReact(rootNode, name);
            case 'vue':
                return this.generateVue(rootNode, name);
            case 'angular':
                return this.generateAngular(rootNode, name);
        }
    }

    // ─── React ───

    private generateReact(root: IRNode, name: string): string {
        const usedTypes = this.collectComponentTypes(root);
        const shadcnImports = getAllShadcnReactImports(usedTypes);

        const importLines: string[] = [
            `import React from 'react';`,
        ];

        for (const [path, names] of shadcnImports) {
            importLines.push(`import { ${names.join(', ')} } from '${path}';`);
        }

        const jsx = this.renderReactNode(root, 1);

        return `${importLines.join('\n')}\n\nexport interface ${name}Props {\n  className?: string;\n}\n\nexport function ${name}({ className }: ${name}Props) {\n  return (\n${jsx}\n  );\n}\n`;
    }

    private renderReactNode(node: IRNode, depth: number): string {
        // Skip invisible nodes
        if (!node.visible) return '';

        // Skip empty decorative nodes (SVG vectors, icons without children)
        if (this.isEmptyDecorativeNode(node)) return '';

        const indent = '    '.repeat(depth);
        const classes = this.buildTailwindClasses(node);
        const mapping = getShadcnReactMapping(node.componentType);

        // Text node — render as inline text
        if (node.componentType === 'text' && node.textContent) {
            const textClasses = this.buildTextClasses(node);
            const allClasses = [...classes, ...textClasses].join(' ');
            return `${indent}<p className="${allClasses}">${this.escapeJsx(node.textContent)}</p>`;
        }

        // Divider
        if (node.componentType === 'divider') {
            if (mapping) {
                return `${indent}<${mapping.wrapperTag} className="${classes.join(' ')}" />`;
            }
            return `${indent}<hr className="${classes.join(' ')}" />`;
        }

        // Build children JSX (filter out empty strings from skipped nodes)
        const childrenJsx = node.children
            .map((child) => this.renderReactNode(child, depth + 1))
            .filter(Boolean)
            .join('\n');

        // shadcn component
        if (mapping) {
            return this.renderShadcnReactComponent(node, mapping, classes, childrenJsx, indent);
        }

        // Generic container
        const tag = node.componentType === 'image' ? 'img' : 'div';
        const classStr = classes.join(' ');

        if (tag === 'img') {
            const imgSrc = node.imageUrl || '';
            return `${indent}<img className="${classStr}" src="${imgSrc}" alt="${node.name}" />`;
        }

        if (childrenJsx) {
            return `${indent}<div className="${classStr}">\n${childrenJsx}\n${indent}</div>`;
        }

        // Skip empty containers with no meaningful content
        if (!classStr || classStr === '') return '';

        return `${indent}<div className="${classStr}" />`;
    }

    private renderShadcnReactComponent(
        node: IRNode, mapping: ShadcnMapping, classes: string[],
        childrenJsx: string, indent: string,
    ): string {
        const props: string[] = [`className="${classes.join(' ')}"`];

        if (mapping.defaultProps) {
            for (const [key, value] of Object.entries(mapping.defaultProps)) {
                props.push(`${key}="${value}"`);
            }
        }

        const propsStr = props.join(' ');
        const tag = mapping.wrapperTag;

        // Button with text
        if (node.componentType === 'button') {
            const btnText = this.extractTextContent(node) || 'Button';
            return `${indent}<${tag} ${propsStr}>${btnText}</${tag}>`;
        }

        // Input — self-closing
        if (!mapping.childrenSlot) {
            const placeholder = this.extractTextContent(node) || '';
            if (placeholder) {
                return `${indent}<${tag} ${propsStr} placeholder="${placeholder}" />`;
            }
            return `${indent}<${tag} ${propsStr} />`;
        }

        // Card with structure
        if (node.componentType === 'card') {
            return this.renderCardReact(node, classes, indent);
        }

        // Generic wrapper
        if (childrenJsx) {
            return `${indent}<${tag} ${propsStr}>\n${childrenJsx}\n${indent}</${tag}>`;
        }

        return `${indent}<${tag} ${propsStr} />`;
    }

    private renderCardReact(node: IRNode, classes: string[], indent: string): string {
        const inner = indent + '  ';
        const lines: string[] = [];
        lines.push(`${indent}<Card className="${classes.join(' ')}">`);

        // Try to extract header / content / footer
        const headerChild = node.children.find((c) => c.name.toLowerCase().includes('header'));
        const footerChild = node.children.find((c) => c.name.toLowerCase().includes('footer'));
        const contentChildren = node.children.filter(
            (c) => c !== headerChild && c !== footerChild,
        );

        if (headerChild) {
            const title = this.extractTextContent(headerChild) || node.name;
            lines.push(`${inner}<CardHeader>`);
            lines.push(`${inner}  <CardTitle>${title}</CardTitle>`);
            lines.push(`${inner}</CardHeader>`);
        }

        if (contentChildren.length > 0) {
            lines.push(`${inner}<CardContent>`);
            for (const child of contentChildren) {
                lines.push(this.renderReactNode(child, (indent.length / 4) + 2));
            }
            lines.push(`${inner}</CardContent>`);
        }

        if (footerChild) {
            lines.push(`${inner}<CardFooter>`);
            lines.push(this.renderReactNode(footerChild, (indent.length / 4) + 2));
            lines.push(`${inner}</CardFooter>`);
        }

        lines.push(`${indent}</Card>`);
        return lines.join('\n');
    }

    // ─── Vue ───

    private generateVue(root: IRNode, name: string): string {
        const usedTypes = this.collectComponentTypes(root);
        const shadcnImports = getAllShadcnVueImports(usedTypes);

        const importLines: string[] = [];
        for (const [path, names] of shadcnImports) {
            importLines.push(`import { ${names.join(', ')} } from '${path}'`);
        }

        const template = this.renderVueNode(root, 2);

        return `<script setup lang="ts">
${importLines.join('\n')}

interface Props {
  class?: string
}

defineProps<Props>()
</script>

<template>
${template}
</template>
`;
    }

    private renderVueNode(node: IRNode, depth: number): string {
        const indent = '  '.repeat(depth);
        const classes = this.buildTailwindClasses(node);
        const mapping = getShadcnVueMapping(node.componentType);

        if (node.componentType === 'text' && node.textContent) {
            const textClasses = [...classes, ...this.buildTextClasses(node)].join(' ');
            return `${indent}<p class="${textClasses}">${node.textContent}</p>`;
        }

        if (node.componentType === 'divider') {
            const tag = mapping ? mapping.wrapperTag : 'hr';
            return `${indent}<${tag} class="${classes.join(' ')}" />`;
        }

        const childrenHtml = node.children
            .map((child) => this.renderVueNode(child, depth + 1))
            .join('\n');

        const tag = mapping ? mapping.wrapperTag : 'div';
        const classStr = classes.join(' ');

        if (node.componentType === 'button') {
            const btnText = this.extractTextContent(node) || 'Button';
            return `${indent}<${tag} class="${classStr}">${btnText}</${tag}>`;
        }

        if (mapping && !mapping.childrenSlot) {
            return `${indent}<${tag} class="${classStr}" />`;
        }

        if (childrenHtml) {
            return `${indent}<${tag} class="${classStr}">\n${childrenHtml}\n${indent}</${tag}>`;
        }

        return `${indent}<${tag} class="${classStr}" />`;
    }

    // ─── Angular ───

    private generateAngular(root: IRNode, name: string): string {
        const usedTypes = this.collectComponentTypes(root);
        const spartanImports = getAllSpartanImports(usedTypes);

        const importLines: string[] = [
            `import { Component } from '@angular/core';`,
            `import { CommonModule } from '@angular/common';`,
        ];
        const allDirectives: string[] = ['CommonModule'];

        for (const [pkg, directives] of spartanImports) {
            importLines.push(`import { ${directives.join(', ')} } from '${pkg}';`);
            allDirectives.push(...directives);
        }

        const template = this.renderAngularNode(root, 3);

        return `${importLines.join('\n')}

@Component({
  selector: 'app-${this.toKebabCase(name)}',
  standalone: true,
  imports: [${allDirectives.join(', ')}],
  template: \`
${template}
  \`
})
export class ${name}Component {}
`;
    }

    private renderAngularNode(node: IRNode, depth: number): string {
        const indent = '    '.repeat(depth);
        const classes = this.buildTailwindClasses(node);
        const mapping = getSpartanMapping(node.componentType);

        if (node.componentType === 'text' && node.textContent) {
            const textClasses = [...classes, ...this.buildTextClasses(node)].join(' ');
            return `${indent}<p class="${textClasses}">${node.textContent}</p>`;
        }

        if (node.componentType === 'divider') {
            return `${indent}<brn-separator class="${classes.join(' ')}" />`;
        }

        const childrenHtml = node.children
            .map((child) => this.renderAngularNode(child, depth + 1))
            .join('\n');

        if (node.componentType === 'button' && mapping) {
            const btnText = this.extractTextContent(node) || 'Button';
            return `${indent}<button hlmBtn class="${classes.join(' ')}">${btnText}</button>`;
        }

        if (mapping) {
            const sel = mapping.selector;
            if (childrenHtml) {
                return `${indent}<${sel} class="${classes.join(' ')}">\n${childrenHtml}\n${indent}</${sel.split(' ')[0]}>`;
            }
            return `${indent}<${sel} class="${classes.join(' ')}" />`;
        }

        if (childrenHtml) {
            return `${indent}<div class="${classes.join(' ')}">\n${childrenHtml}\n${indent}</div>`;
        }

        return `${indent}<div class="${classes.join(' ')}" />`;
    }

    // ─── Shared Helpers ───

    private buildTailwindClasses(node: IRNode): string[] {
        const classes: string[] = [];

        // Layout
        const layoutClasses = layoutToTailwindClasses(node.layout);

        // For horizontal layouts, apply mobile-first stacking
        if (shouldStackOnMobile(node)) {
            // Replace 'flex' + (no 'flex-col') with 'flex flex-col md:flex-row'
            const filtered = layoutClasses.filter((c) => c !== 'flex-row' && c !== 'flex');
            classes.push('flex', 'flex-col', 'md:flex-row', ...filtered);
        } else {
            classes.push(...layoutClasses);
        }

        // Dimensions
        if (node.dimensions.width === 'fill') classes.push('w-full');
        else if (node.dimensions.width === 'auto') classes.push('w-fit');

        if (node.dimensions.height === 'fill') classes.push('h-full');
        else if (node.dimensions.height === 'auto') classes.push('h-fit');

        // Min/max
        if (node.dimensions.minWidth) classes.push(`min-w-[${Math.round(node.dimensions.minWidth)}px]`);
        if (node.dimensions.maxWidth) classes.push(`max-w-[${Math.round(node.dimensions.maxWidth)}px]`);

        // Background fills — skip for text nodes (they use text-color instead)
        const isTextLike = node.componentType === 'text' || node.componentType === 'icon';
        if (!isTextLike) {
            classes.push(...fillsToTailwindClasses(node.fills));
        }

        // Borders
        if (node.borders.length > 0) {
            const b = node.borders[0];
            classes.push('border');
            if (b.width > 1) classes.push(`border-[${b.width}px]`);
            classes.push(irColorToTailwind(b.color, 'border'));
        }

        // Border radius
        const r = node.borderRadius;
        if (r.topLeft === r.topRight && r.topRight === r.bottomRight && r.bottomRight === r.bottomLeft) {
            if (r.topLeft > 0) {
                classes.push(this.borderRadiusToTailwind(r.topLeft));
            }
        } else {
            if (r.topLeft > 0) classes.push(`rounded-tl-[${r.topLeft}px]`);
            if (r.topRight > 0) classes.push(`rounded-tr-[${r.topRight}px]`);
            if (r.bottomRight > 0) classes.push(`rounded-br-[${r.bottomRight}px]`);
            if (r.bottomLeft > 0) classes.push(`rounded-bl-[${r.bottomLeft}px]`);
        }

        // Shadows
        for (const shadow of node.shadows) {
            if (shadow.type === 'drop') {
                classes.push(this.shadowToTailwind(shadow));
            } else {
                classes.push(`shadow-inner`);
            }
        }

        // Opacity
        if (node.opacity < 1) {
            classes.push(`opacity-${Math.round(node.opacity * 100)}`);
        }

        // Overflow
        if (node.clipContent) classes.push('overflow-hidden');

        // Responsive overrides
        const overrides = generateResponsiveOverrides(node);
        if (overrides.length > 0) {
            for (const ovr of overrides) {
                for (const cls of ovr.classes) {
                    classes.push(`${ovr.breakpoint}:${cls}`);
                }
            }
        }

        return classes;
    }

    private buildTextClasses(node: IRNode): string[] {
        const classes: string[] = [];
        const ts = node.textStyle;
        if (!ts) return classes;

        // Font size
        const sizeMap: Record<number, string> = {
            12: 'text-xs', 14: 'text-sm', 16: 'text-base', 18: 'text-lg',
            20: 'text-xl', 24: 'text-2xl', 30: 'text-3xl', 36: 'text-4xl',
            48: 'text-5xl', 60: 'text-6xl', 72: 'text-7xl', 96: 'text-8xl', 128: 'text-9xl',
        };
        classes.push(sizeMap[ts.fontSize] ?? `text-[${ts.fontSize}px]`);

        // Font weight
        const weightMap: Record<number, string> = {
            100: 'font-thin', 200: 'font-extralight', 300: 'font-light',
            400: 'font-normal', 500: 'font-medium', 600: 'font-semibold',
            700: 'font-bold', 800: 'font-extrabold', 900: 'font-black',
        };
        classes.push(weightMap[ts.fontWeight] ?? `font-[${ts.fontWeight}]`);

        // Alignment
        if (ts.textAlign !== 'left') {
            classes.push(`text-${ts.textAlign}`);
        }

        // Transform
        if (ts.textTransform && ts.textTransform !== 'none') {
            classes.push(ts.textTransform);
        }

        // Decoration
        if (ts.textDecoration && ts.textDecoration !== 'none') {
            classes.push(ts.textDecoration);
        }

        // Italic
        if (ts.italic) classes.push('italic');

        // Text color from fills
        if (node.fills.length > 0 && node.fills[0].type === 'solid' && node.fills[0].color) {
            classes.push(irColorToTailwind(node.fills[0].color, 'text'));
        }

        return classes;
    }

    private borderRadiusToTailwind(r: number): string {
        const map: Record<number, string> = {
            2: 'rounded-sm', 4: 'rounded', 6: 'rounded-md',
            8: 'rounded-lg', 12: 'rounded-xl', 16: 'rounded-2xl',
            24: 'rounded-3xl', 9999: 'rounded-full',
        };
        // Find closest
        let closest = 'rounded';
        let minDist = Infinity;
        for (const [px, cls] of Object.entries(map)) {
            const dist = Math.abs(Number(px) - r);
            if (dist < minDist) { minDist = dist; closest = cls; }
        }
        return minDist <= 2 ? closest : `rounded-[${r}px]`;
    }

    private shadowToTailwind(shadow: { blur: number; spread: number; offsetY: number }): string {
        if (shadow.blur <= 3 && shadow.offsetY <= 1) return 'shadow-sm';
        if (shadow.blur <= 6 && shadow.offsetY <= 2) return 'shadow';
        if (shadow.blur <= 10 && shadow.offsetY <= 4) return 'shadow-md';
        if (shadow.blur <= 15 && shadow.offsetY <= 6) return 'shadow-lg';
        if (shadow.blur <= 25 && shadow.offsetY <= 10) return 'shadow-xl';
        return 'shadow-2xl';
    }

    private extractTextContent(node: IRNode): string | undefined {
        if (node.textContent) return node.textContent;
        for (const child of node.children) {
            const text = this.extractTextContent(child);
            if (text) return text;
        }
        return undefined;
    }

    private collectComponentTypes(node: IRNode): IRComponentType[] {
        const types: IRComponentType[] = [node.componentType];
        for (const child of node.children) {
            types.push(...this.collectComponentTypes(child));
        }
        return [...new Set(types)];
    }

    private toPascalCase(str: string): string {
        return str
            .replace(/[^a-zA-Z0-9]+/g, ' ')
            .split(' ')
            .filter(Boolean)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }

    private toKebabCase(str: string): string {
        return str
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/[^a-zA-Z0-9]+/g, '-')
            .toLowerCase();
    }

    private escapeJsx(text: string): string {
        return text.replace(/[{}<>&"]/g, (c) => {
            switch (c) {
                case '{': return '&#123;';
                case '}': return '&#125;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '"': return '&quot;';
                default: return c;
            }
        });
    }

    /** Check if a node is a purely decorative element with no meaningful content */
    private isEmptyDecorativeNode(node: IRNode): boolean {
        // Icon/vector nodes without children are SVG paths — no way to render them as divs
        if (node.componentType === 'icon' && node.children.length === 0) return true;

        // Unknown type with no children and no text — likely a decorative shape
        if (node.componentType === 'unknown' && node.children.length === 0 && !node.textContent) return true;

        // Container with no children, no text, and only fill — just a colored rectangle
        if (node.componentType === 'container' && node.children.length === 0 && !node.textContent) {
            // Keep if it has meaningful dimensions (might be a spacer or divider)
            const w = node.dimensions.width;
            const h = node.dimensions.height;
            if (w === 'auto' && h === 'auto') return true;
            if (w === 'fill' && h === 'auto') return true;
        }

        return false;
    }
}
