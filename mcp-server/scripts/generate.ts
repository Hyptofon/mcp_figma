// ─── Fetch Figma design, export images, and generate code — v5 ───
// Zero-touch pipeline: one URL → design tokens + semantic components + images

import { FigmaApiService } from '../src/services/figma-api.service.js';
import { FigmaParserService } from '../src/services/figma-parser.service.js';
import { ComponentGeneratorService } from '../src/services/component-generator.service.js';
import { AstroPageGeneratorService } from '../src/services/astro-page-generator.service.js';
import { DesignTokensService } from '../src/services/design-tokens.service.js';
import type { IRNode } from '../src/types/ir.types.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FILE_KEY = 'x3CNT2FkJfxPO0q1lcjZ81';
const NODE_ID = '2142:6765';
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
    const tokenService = new DesignTokensService();

    // Step 1: Fetch
    const response = await api.fetchFileNodes(FILE_KEY, [NODE_ID]);
    console.log(`✅ Fetched: "${response.name}"`);

    // Step 2: Parse to IR
    const designTree = parser.parse(response, NODE_ID);
    const mainFrame = designTree.rootNode.children[0];
    if (!mainFrame) { console.error('❌ No children'); process.exit(1); }

    console.log(`✅ "${mainFrame.name}" → ${mainFrame.children.length} children`);

    // Output dirs
    const genDir = path.resolve(__dirname, '../../generated');
    const srcComponents = path.resolve(__dirname, '../../src/components/sections');
    const srcPages = path.resolve(__dirname, '../../src/pages');
    const srcStyles = path.resolve(__dirname, '../../src/styles');
    const publicImages = path.resolve(__dirname, '../../public/images');
    fs.mkdirSync(genDir, { recursive: true });
    fs.mkdirSync(srcComponents, { recursive: true });
    fs.mkdirSync(srcPages, { recursive: true });
    fs.mkdirSync(srcStyles, { recursive: true });
    fs.mkdirSync(publicImages, { recursive: true });

    // Save IR
    fs.writeFileSync(path.join(genDir, 'design-ir.json'), JSON.stringify(designTree, null, 2), 'utf-8');

    // ─── Step 3: EXTRACT DESIGN TOKENS ───
    console.log(`\n🎨 Extracting design tokens...`);
    const { tokens, tokenMap } = tokenService.extract(mainFrame);
    console.log(`   Found ${tokens.length} tokens (${tokens.filter(t => t.type === 'color').length} colors, ${tokens.filter(t => t.type === 'gradient').length} gradients)`);

    const tokensCss = tokenService.generateCss(tokens);
    const tokensFilePath = path.join(srcStyles, 'figma-tokens.css');
    fs.writeFileSync(tokensFilePath, tokensCss, 'utf-8');
    console.log(`✅ Design tokens → src/styles/figma-tokens.css`);

    // Ensure global.css imports figma-tokens.css
    const globalCssPath = path.join(srcStyles, 'global.css');
    if (fs.existsSync(globalCssPath)) {
        const globalCssContent = fs.readFileSync(globalCssPath, 'utf-8');
        if (!globalCssContent.includes('figma-tokens.css')) {
            // Add import at the top, after existing imports
            const importLine = `@import './figma-tokens.css';\n`;
            const updatedContent = globalCssContent.replace(
                /(@import[^;]+;\n)/,
                `$1${importLine}`,
            );
            fs.writeFileSync(globalCssPath, updatedContent, 'utf-8');
            console.log(`✅ Added @import 'figma-tokens.css' to global.css`);
        }
    }

    // ─── Step 4: EXPORT IMAGES FROM FIGMA ───
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
                    console.log(`⚠️  No URL for "${node.name}" (${node.id})`);
                    continue;
                }

                const fileName = sanitizeFileName(node.name) + '.png';
                const filePath = path.join(publicImages, fileName);

                try {
                    await downloadFile(cdnUrl, filePath);
                    // Patch imageUrl on ALL matching nodes in the tree (not just collected ones)
                    patchImageUrl(mainFrame, node.id, `/images/${fileName}`);
                    downloaded++;
                    console.log(`✅ ${fileName}`);
                } catch (err: any) {
                    console.log(`⚠️  Failed to download "${node.name}": ${err.message}`);
                }
            }

            console.log(`🖼️  Downloaded ${downloaded}/${imageNodes.length} images`);
        } catch (err: any) {
            console.error(`⚠️ Image export failed: ${err.message}`);
            console.log('      Continuing without images...');
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
                    patchImageUrl(mainFrame, node.id, `/images/${fileName}`);
                    bgDownloaded++;
                    console.log(`   ✅ ${fileName}`);
                } catch { }
            }
            console.log(`🎨 Downloaded ${bgDownloaded}/${bgImageNodes.length} background images`);
        } catch (err: any) {
            console.log(`   ⚠️  Background export failed: ${err.message}`);
        }
    }

    // ─── Step 5: Generate Components (with design tokens) ───
    const sections = extractSections(mainFrame.children);
    console.log(`\n📦 ${sections.length} sections:`);

    const childComponents: Array<{ name: string; framework: 'react'; hydration: 'client:load' | 'client:visible' | 'none'; code: string }> = [];

    for (const section of sections) {
        const code = componentGen.generate(section.node, 'react', section.name, tokenMap);
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

    // ─── Step 6: Generate Astro page ───
    // Derive page name based on the content of the frame
    const pageName = derivePageName(mainFrame);

    const astroCode = pageGen.generate(
        designTree,
        pageName,
        childComponents,
        `ІІТБ — ${mainFrame.name}`,
        'Обирай навчання, яке відповідає викликам майбутнього. IT, бізнес, менеджмент, фінанси, маркетинг.',
    );

    fs.writeFileSync(path.join(srcPages, `${pageName}.astro`), astroCode, 'utf-8');
    fs.writeFileSync(path.join(genDir, `${pageName}.astro`), astroCode, 'utf-8');

    console.log(`\n✅ Astro page → src/pages/${pageName}.astro`);
    console.log(`🎉 Done! ${sections.length} components + ${tokens.length} design tokens + images generated for page '${pageName}'.`);
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

/** Recursively patch imageUrl on all nodes with a matching id */
function patchImageUrl(node: IRNode, targetId: string, url: string): void {
    if (node.id === targetId) {
        node.imageUrl = url;
    }
    for (const child of node.children) {
        patchImageUrl(child, targetId, url);
    }
}

/** Download a file from URL to disk */
async function downloadFile(url: string, filePath: string): Promise<void> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
}

// ─── Cyrillic transliteration map ───
const TRANSLIT: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
    'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
    'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu',
    'я': 'ya', 'ы': 'y', 'э': 'e', 'ъ': '',
};

/** Sanitize a Figma node name into a safe filename with Cyrillic transliteration */
function sanitizeFileName(name: string): string {
    // Transliterate Cyrillic
    const transliterated = name.toLowerCase().split('').map(c => TRANSLIT[c] ?? c).join('');
    return transliterated
        .replace(/[^a-zA-Z0-9_\- ]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase()
        .slice(0, 60) || 'image';
}

// ─── Section extraction — v5 with improved semantic naming ───

interface Section {
    name: string;
    node: IRNode;
    description: string;
    interactive: boolean;
}

function extractSections(children: IRNode[]): Section[] {
    const sections: Section[] = [];
    const usedNames = new Set<string>();

    for (const child of children) {
        const name = child.name.toLowerCase();

        // Skip decorative/gradient overlays
        if (name.includes('gradient') || name.includes('3d') || name.includes('chrome shape')) continue;
        if (name.includes('background') && countDeepChildren(child) < 3) continue;

        // Detect header
        if (child.componentType === 'navbar' && (name === 'header' || name.includes('nav'))) {
            const sectionName = name.includes('footer') || isAtBottom(child, children) ? 'SiteFooter' : 'SiteHeader';
            sections.push({ name: sectionName, node: child, description: sectionName === 'SiteFooter' ? 'Футер' : 'Навбар', interactive: true });
            continue;
        }

        // Detect footer by position or name
        if (child.componentType === 'footer' || (name.includes('footer') && !name.includes('header'))) {
            sections.push({ name: 'SiteFooter', node: child, description: 'Футер', interactive: true });
            continue;
        }

        const sectionName = deriveEnglishName(child, sections.length, usedNames);
        const interactive = hasInteractiveChildren(child);
        usedNames.add(sectionName.name);
        sections.push({ name: sectionName.name, node: child, description: sectionName.desc, interactive });
    }

    return sections;
}

/** Check if a node is near the bottom of the page (last 20% of children) */
function isAtBottom(node: IRNode, siblings: IRNode[]): boolean {
    const idx = siblings.indexOf(node);
    return idx >= siblings.length * 0.8;
}

function findProminentText(node: IRNode, maxDepth: number, depth = 0): string | undefined {
    if (depth > maxDepth) return undefined;
    // Prefer large text
    if (node.componentType === 'text' && node.textStyle && node.textContent && node.textContent.length > 2) {
        if (node.textStyle.fontSize >= 24) return node.textContent;
    }
    for (const child of node.children) {
        const t = findProminentText(child, maxDepth, depth + 1);
        if (t) return t;
    }
    return undefined;
}

function deriveEnglishName(node: IRNode, index: number, usedNames: Set<string>): { name: string; desc: string } {
    const allTexts = collectAllTexts(node, 10);
    const combined = allTexts.join(' ').toLowerCase();

    // ─── Structure-based heuristics ───
    const totalChildren = countDeepChildren(node);

    // Many children with no text — likely logos/partners grid
    if (totalChildren > 20 && allTexts.length === 0) return uniqueName('PartnersSection', 'Логотипи', usedNames);

    // Large background image node with few children — hero-like
    if (node.fills.some(f => f.type === 'image') && totalChildren < 10) return uniqueName('HeroSection', 'Hero Banner', usedNames);

    // Semantic text-based heuristic
    if (allTexts.length > 0) {
        // Find text node that is likely a header
        let titleText = findProminentText(node, 10);
        if (!titleText) {
            titleText = allTexts[0]; // fallback to first text found
        }

        const words = titleText.split(/\s+/).slice(0, 3);
        const sanitized = words.map(w => sanitizeFileName(w)).join('-');

        // Convert to pascal case
        const pascal = sanitized.split('-').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
        if (pascal.length >= 3) {
            return uniqueName(pascal + 'Section', titleText.slice(0, 30), usedNames);
        }
    }

    // Fallback: use ContentBlock instead of Section
    return uniqueName(`ContentBlock${index + 1}`, `Контент-блок #${index + 1}`, usedNames);
}

/** Ensure name uniqueness by appending a number if needed */
function uniqueName(baseName: string, desc: string, usedNames: Set<string>): { name: string; desc: string } {
    if (!usedNames.has(baseName)) return { name: baseName, desc };
    let i = 2;
    while (usedNames.has(`${baseName}${i}`)) i++;
    return { name: `${baseName}${i}`, desc: `${desc} #${i}` };
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

/** Derive page name based on text content heuristics */
function derivePageName(node: IRNode): string {
    const allTexts = collectAllTexts(node, 10);
    const combined = allTexts.join(' ').toLowerCase();

    // Content heuristics
    if (combined.includes('контакт') || combined.includes("зв'язок") || combined.includes('contact us') || combined.includes('адрес')) return 'contact';
    if (combined.includes('про нас') || combined.includes('про інститут') || combined.includes('about us') || combined.includes('about')) return 'about';
    if (combined.includes('послуг') || combined.includes('services')) return 'services';
    if (combined.includes('цін') || combined.includes('pricing') || combined.includes('прайс') || combined.includes('вартість')) return 'pricing';
    if (combined.includes('відгук') || combined.includes('testimonial')) return 'testimonials';
    if (combined.includes('блог') || combined.includes('новини') || combined.includes('статт') || combined.includes('blog') || combined.includes('news')) return 'blog';
    if (combined.includes('faq') || combined.includes('frequently asked') || combined.includes('питанн')) return 'faq';
    if (combined.includes('команд') || combined.includes('team') || combined.includes('керівництво') || combined.includes('кафедр')) return 'team';
    if (combined.includes('галере') || combined.includes('gallery') || combined.includes('фото')) return 'gallery';
    if (combined.includes('спеціальності') || combined.includes('бакалаврат')) return 'programs';

    // Fallback to name
    const rawPageName = node.name.toLowerCase().trim();
    let pageName = sanitizeFileName(rawPageName);

    if (
        pageName === 'home' ||
        pageName === 'index' ||
        pageName === 'main' ||
        pageName === 'desktop' ||
        pageName === 'landing' ||
        pageName === 'holovna' ||
        pageName === 'головна' ||
        pageName === ''
    ) {
        return 'index';
    }

    return pageName || 'index';
}


main().catch(err => {
    console.error('❌ Error:', err.message || err);
    process.exit(1);
});
