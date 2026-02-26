// ─── IR → Astro Page Generator ───

import type { IRNode, IRDesignTree } from '../types/ir.types.js';
import type { ChildComponent } from '../types/mcp.types.js';
import { layoutToTailwindClasses } from '../utils/layout.utils.js';
import { fillsToTailwindClasses, irColorToTailwind } from '../utils/color.utils.js';
import { shouldStackOnMobile } from '../utils/responsive.utils.js';

export class AstroPageGeneratorService {

    generate(
        designTree: IRDesignTree,
        pageName: string,
        childComponents: ChildComponent[],
        title: string,
        description: string,
    ): string {
        const root = designTree.rootNode;

        // ─── Frontmatter (import block) ───
        const imports = this.buildImports(childComponents);
        const bodyClasses = this.buildBodyClasses(root);
        const componentSlots = this.buildComponentSlots(root, childComponents);

        return `---
import '../styles/global.css';
${imports}

const title = "${title}";
const description = "${description}";
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body class="${bodyClasses}">
    <main class="min-h-screen w-full">
${componentSlots}
    </main>
  </body>
</html>
`;
    }

    private buildImports(childComponents: ChildComponent[]): string {
        const lines: string[] = [];

        for (const comp of childComponents) {
            const ext = this.getExtension(comp.framework);
            // Astro imports use relative or alias paths
            lines.push(`import { ${comp.name} } from '../components/sections/${comp.name}${ext}';`);
        }

        return lines.join('\n');
    }

    private getExtension(framework: string): string {
        switch (framework) {
            case 'react': return '.tsx';
            case 'vue': return '.vue';
            case 'angular': return ''; // Angular uses module imports
            default: return '.tsx';
        }
    }

    private buildBodyClasses(root: IRNode): string {
        const classes: string[] = ['antialiased'];

        // Background
        const bgClasses = fillsToTailwindClasses(root.fills);
        if (bgClasses.length > 0) {
            classes.push(...bgClasses);
        } else {
            classes.push('bg-background');
        }

        // Text color (from root fills or default)
        classes.push('text-foreground');

        return classes.join(' ');
    }

    private buildComponentSlots(root: IRNode, childComponents: ChildComponent[]): string {
        // If no child components, render the root tree as static HTML
        if (childComponents.length === 0) {
            return this.renderStaticNode(root, 3);
        }

        // Render each child component with appropriate Astro hydration directive
        const lines: string[] = [];
        const containerClasses = this.buildContainerClasses(root);

        lines.push(`      <div class="${containerClasses}">`);

        for (const comp of childComponents) {
            const directive = comp.hydration !== 'none' ? ` ${comp.hydration}` : '';

            if (comp.framework === 'angular') {
                // Angular components need client:only="angular"
                lines.push(`        <${comp.name} client:only="${comp.framework}" />`);
            } else {
                lines.push(`        <${comp.name}${directive} />`);
            }
        }

        lines.push(`      </div>`);
        return lines.join('\n');
    }

    private buildContainerClasses(root: IRNode): string {
        const classes: string[] = [];

        // Layout from root node
        const layoutClasses = layoutToTailwindClasses(root.layout);

        if (shouldStackOnMobile(root)) {
            const filtered = layoutClasses.filter((c) => c !== 'flex-row' && c !== 'flex');
            classes.push('flex', 'flex-col', 'md:flex-row', ...filtered);
        } else {
            classes.push(...layoutClasses);
        }

        // Responsive container
        classes.push('mx-auto', 'max-w-7xl', 'px-4', 'sm:px-6', 'lg:px-8');

        return classes.join(' ');
    }

    private renderStaticNode(node: IRNode, depth: number): string {
        const indent = '  '.repeat(depth);

        if (!node.visible) return '';

        // Text node
        if (node.componentType === 'text' && node.textContent) {
            const classes = this.buildNodeClasses(node);
            const tag = this.inferHtmlTag(node);
            return `${indent}<${tag} class="${classes}">${node.textContent}</${tag}>`;
        }

        // Container with children
        const classes = this.buildNodeClasses(node);
        const tag = this.inferSemanticTag(node);
        const children = node.children
            .filter((c) => c.visible)
            .map((c) => this.renderStaticNode(c, depth + 1))
            .filter(Boolean)
            .join('\n');

        if (children) {
            return `${indent}<${tag} class="${classes}">\n${children}\n${indent}</${tag}>`;
        }

        // Self-closing
        if (node.componentType === 'image') {
            return `${indent}<img class="${classes}" src="" alt="${node.name}" />`;
        }

        if (node.componentType === 'divider') {
            return `${indent}<hr class="${classes}" />`;
        }

        return `${indent}<${tag} class="${classes}" />`;
    }

    private buildNodeClasses(node: IRNode): string {
        const classes: string[] = [];

        // Layout
        const layoutClasses = layoutToTailwindClasses(node.layout);
        if (shouldStackOnMobile(node)) {
            const filtered = layoutClasses.filter((c) => c !== 'flex-row' && c !== 'flex');
            classes.push('flex', 'flex-col', 'md:flex-row', ...filtered);
        } else {
            classes.push(...layoutClasses);
        }

        // Fills
        classes.push(...fillsToTailwindClasses(node.fills));

        // Dimensions
        if (node.dimensions.width === 'fill') classes.push('w-full');
        if (node.dimensions.height === 'fill') classes.push('h-full');

        // Borders
        if (node.borders.length > 0) {
            classes.push('border', irColorToTailwind(node.borders[0].color, 'border'));
        }

        // Border radius
        const r = node.borderRadius;
        if (r.topLeft > 0 && r.topLeft === r.topRight && r.topRight === r.bottomRight && r.bottomRight === r.bottomLeft) {
            classes.push(`rounded-[${r.topLeft}px]`);
        }

        return classes.join(' ');
    }

    private inferHtmlTag(node: IRNode): string {
        if (!node.textStyle) return 'p';
        const size = node.textStyle.fontSize;
        if (size >= 48) return 'h1';
        if (size >= 36) return 'h2';
        if (size >= 24) return 'h3';
        if (size >= 20) return 'h4';
        if (size >= 16) return 'p';
        return 'span';
    }

    private inferSemanticTag(node: IRNode): string {
        switch (node.componentType) {
            case 'navbar': return 'nav';
            case 'footer': return 'footer';
            case 'hero': return 'section';
            case 'sidebar': return 'aside';
            case 'card': return 'article';
            default: return 'div';
        }
    }
}
