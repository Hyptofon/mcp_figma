// ─── Fetch Figma design, export images, and generate code — v4 ───

import { FigmaApiService } from '../src/services/figma-api.service.js';
import { FigmaParserService } from '../src/services/figma-parser.service.js';
import { ComponentGeneratorService } from '../src/services/component-generator.service.js';
import { AstroPageGeneratorService } from '../src/services/astro-page-generator.service.js';
import type { IRNode } from '../src/types/ir.types.js';
import * as fs from 'fs';
import * as path from 'path';

const FILE_KEY = 'x3CNT2FkJfxPO0q1lcjZ81';
const NODE_ID = '530:5377';
const TOKEN = process.env.FIGMA_PERSONAL_ACCESS_TOKEN || '';

async function main() {
    if (!TOKEN) {
        console.error('ERROR: FIGMA_PERSONAL_ACCESS_TOKEN not set');
        process.exit(1);
    }

    console.log(`📡 Fetching Figma design: fileKey=${FILE_KEY}, nodeId=${NODE_ID}...`);

    const api = new FigmaApiService({ accessToken: TOKEN });
    const parser = new FigmaParserService();
    const componentGen = new ComponentGeneratorService();
    const pageGen = new AstroPageGeneratorService();

    // Step 1: Fetch
    const response = await api.fetchFileNodes(FILE_KEY, [NODE_ID]);
    console.log(`✅ Fetched: "${response.name}"`);

    // Step 2: Parse to IR
    const designTree = parser.parse(response, NODE_ID);
    const mainFrame = designTree.rootNode.children[0];
    if (!mainFrame) { console.error('❌ No children'); process.exit(1); }

    console.log(`✅ "${mainFrame.name}" → ${mainFrame.children.length} children`);

    // Output dirs
    const genDir = path.resolve(import.meta.dirname, '../../generated');
    const srcComponents = path.resolve(import.meta.dirname, '../../src/components/sections');
    const srcPages = path.resolve(import.meta.dirname, '../../src/pages');
    const publicImages = path.resolve(import.meta.dirname, '../../public/images');
    fs.mkdirSync(genDir, { recursive: true });
    fs.mkdirSync(srcComponents, { recursive: true });
    fs.mkdirSync(srcPages, { recursive: true });
    fs.mkdirSync(publicImages, { recursive: true });

    // Save IR
    fs.writeFileSync(path.join(genDir, 'design-ir.json'), JSON.stringify(designTree, null, 2), 'utf-8');

    // ─── Step 3: EXPORT IMAGES FROM FIGMA ───
    console.log(`\n🖼️  Collecting image nodes...`);
    const imageNodes = collectImageNodes(mainFrame);
    console.log(`   Found ${imageNodes.length} image nodes`);

    if (imageNodes.length > 0) {
        const imageIds = imageNodes.map(n => n.id);
        console.log(`📡 Exporting ${imageIds.length} images from Figma API (scale=2, format=png)...`);

        try {
            const imageUrlMap = await api.exportImages(FILE_KEY, imageIds, 'png', 2);
            console.log(`✅ Got ${Object.keys(imageUrlMap).length} image URLs`);

            // Download each image
            let downloaded = 0;
            for (const node of imageNodes) {
                const cdnUrl = imageUrlMap[node.id];
                if (!cdnUrl) {
                    console.log(`   ⚠️  No URL for "${node.name}" (${node.id})`);
                    continue;
                }

                const fileName = sanitizeFileName(node.name) + '.png';
                const filePath = path.join(publicImages, fileName);

                try {
                    await downloadFile(cdnUrl, filePath);
                    // Set the imageUrl on the IR node so the component generator uses it
                    node.imageUrl = `/images/${fileName}`;
                    downloaded++;
                    console.log(`   ✅ ${fileName}`);
                } catch (err: any) {
                    console.log(`   ⚠️  Failed to download "${node.name}": ${err.message}`);
                }
            }

            console.log(`🖼️  Downloaded ${downloaded}/${imageNodes.length} images`);
        } catch (err: any) {
            console.error(`⚠️  Image export failed: ${err.message}`);
            console.log('   Continuing without images...');
        }
    }

    // Also handle background images (nodes with imageRef in fills)
    const bgImageNodes = collectBackgroundImageNodes(mainFrame);
    if (bgImageNodes.length > 0) {
        console.log(`\n🎨 Found ${bgImageNodes.length} background image nodes`);
        const bgIds = bgImageNodes.map(n => n.id);

        try {
            const bgUrlMap = await api.exportImages(FILE_KEY, bgIds, 'png', 2);
            let bgDownloaded = 0;
            for (const node of bgImageNodes) {
                const cdnUrl = bgUrlMap[node.id];
                if (!cdnUrl) continue;

                const fileName = 'bg-' + sanitizeFileName(node.name) + '.png';
                const filePath = path.join(publicImages, fileName);

                try {
                    await downloadFile(cdnUrl, filePath);
                    node.imageUrl = `/images/${fileName}`;
                    bgDownloaded++;
                    console.log(`   ✅ ${fileName}`);
                } catch { }
            }
            console.log(`🎨 Downloaded ${bgDownloaded}/${bgImageNodes.length} background images`);
        } catch (err: any) {
            console.log(`   ⚠️  Background export failed: ${err.message}`);
        }
    }

    // ─── Step 4: Generate Components ───
    const sections = extractSections(mainFrame.children);
    console.log(`\n📦 ${sections.length} sections:`);

    const childComponents: Array<{ name: string; framework: 'react'; hydration: 'client:load' | 'client:visible' | 'none'; code: string }> = [];

    for (const section of sections) {
        const code = componentGen.generate(section.node, 'react', section.name);
        const fileName = `${section.name}.tsx`;

        fs.writeFileSync(path.join(srcComponents, fileName), code, 'utf-8');
        fs.writeFileSync(path.join(genDir, fileName), code, 'utf-8');

        childComponents.push({
            name: section.name,
            framework: 'react',
            hydration: section.interactive ? 'client:load' : 'none',
            code,
        });

        console.log(`   ✅ ${fileName} (${section.description})`);
    }

    // Step 5: Generate Astro page
    const astroCode = pageGen.generate(
        designTree,
        'index',
        childComponents,
        'ІІТБ — Інститут інформаційних технологій та бізнесу',
        'Обирай навчання, яке відповідає викликам майбутнього. IT, бізнес, менеджмент, фінанси, маркетинг.',
    );

    fs.writeFileSync(path.join(srcPages, 'index.astro'), astroCode, 'utf-8');
    fs.writeFileSync(path.join(genDir, 'index.astro'), astroCode, 'utf-8');

    console.log(`\n✅ Astro page → src/pages/index.astro`);
    console.log(`🎉 Done! ${sections.length} components + images generated.`);
}

// ─── Image collection helpers ───

/** Collect all nodes with componentType === 'image' */
function collectImageNodes(node: IRNode): IRNode[] {
    const images: IRNode[] = [];
    if (node.componentType === 'image') {
        images.push(node);
    }
    for (const child of node.children) {
        images.push(...collectImageNodes(child));
    }
    return images;
}

/** Collect nodes with imageRef in their fills (background images) */
function collectBackgroundImageNodes(node: IRNode): IRNode[] {
    const nodes: IRNode[] = [];
    const hasImageFill = node.fills.some(f => f.type === 'image' && f.imageRef);
    if (hasImageFill && node.componentType !== 'image') {
        nodes.push(node);
    }
    for (const child of node.children) {
        nodes.push(...collectBackgroundImageNodes(child));
    }
    return nodes;
}

/** Download a file from URL to disk */
async function downloadFile(url: string, filePath: string): Promise<void> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
}

/** Sanitize a Figma node name into a safe filename */
function sanitizeFileName(name: string): string {
    return name
        .replace(/[^a-zA-Z0-9\u0400-\u04FF_\- ]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase()
        .slice(0, 60) || 'image';
}

// ─── Section extraction (same as v3) ───

interface Section {
    name: string;
    node: IRNode;
    description: string;
    interactive: boolean;
}

function extractSections(children: IRNode[]): Section[] {
    const sections: Section[] = [];

    for (const child of children) {
        const name = child.name.toLowerCase();

        if (name.includes('gradient') || name.includes('3d') || name.includes('chrome shape')) continue;

        if (child.componentType === 'navbar' && name === 'header') {
            sections.push({ name: 'SiteHeader', node: child, description: 'Навбар', interactive: true });
            continue;
        }
        if (child.componentType === 'navbar' && name === 'nav') {
            sections.push({ name: 'SiteFooter', node: child, description: 'Футер', interactive: true });
            continue;
        }

        const sectionName = deriveEnglishName(child, sections.length);
        const interactive = hasInteractiveChildren(child);
        sections.push({ name: sectionName.name, node: child, description: sectionName.desc, interactive });
    }

    return sections;
}

function deriveEnglishName(node: IRNode, index: number): { name: string; desc: string } {
    const allTexts = collectAllTexts(node, 10);
    const combined = allTexts.join(' ').toLowerCase();

    if (combined.includes('обирай навчання') || combined.includes('виклик')) return { name: 'HeroSection', desc: 'Hero' };
    if (combined.includes('інститут інформаційних') || combined.includes('цифрової ери')) return { name: 'AboutSection', desc: 'Про інститут' };
    if (combined.includes('бакалаврат') || combined.includes('спеціальності')) return { name: 'ProgramsSection', desc: 'Спеціальності' };
    if (combined.includes('кафедр')) return { name: 'DepartmentsSection', desc: 'Кафедри' };
    if (combined.includes('керівництво')) return { name: 'LeadershipSection', desc: 'Керівництво' };
    if (combined.includes('інноваційн') || combined.includes('500+')) return { name: 'StatsSection', desc: 'Інновації' };
    if (combined.includes('новини') || combined.includes('події')) return { name: 'NewsSection', desc: 'Новини' };
    if (combined.includes('партнер')) return { name: 'PartnersSection', desc: 'Партнери' };

    const totalChildren = countDeepChildren(node);
    if (totalChildren > 20 && allTexts.length === 0) return { name: 'PartnersSection', desc: 'Логотипи' };

    return { name: `Section${index + 1}`, desc: `Секція #${index + 1}` };
}

function collectAllTexts(node: IRNode, maxDepth: number, depth = 0): string[] {
    if (depth > maxDepth) return [];
    const texts: string[] = [];
    if (node.textContent && node.textContent.length > 2) texts.push(node.textContent);
    for (const child of node.children) texts.push(...collectAllTexts(child, maxDepth, depth + 1));
    return texts;
}

function countDeepChildren(node: IRNode): number {
    let count = node.children.length;
    for (const child of node.children) count += countDeepChildren(child);
    return count;
}

function hasInteractiveChildren(node: IRNode): boolean {
    if (node.isInteractive) return true;
    return node.children.some(hasInteractiveChildren);
}

main().catch(err => {
    console.error('❌ Error:', err.message || err);
    process.exit(1);
});
