// ─── shadcn/ui (React) Component Mapper ───

import type { IRComponentType } from '../types/ir.types.js';

export interface ShadcnMapping {
    componentName: string;
    importPath: string;
    imports: string[];
    wrapperTag: string;
    defaultProps?: Record<string, string>;
    childrenSlot: boolean;
}

const SHADCN_REACT_MAP: Partial<Record<IRComponentType, ShadcnMapping>> = {
    button: {
        componentName: 'Button',
        importPath: '@/components/ui/button',
        imports: ['Button'],
        wrapperTag: 'Button',
        defaultProps: { variant: 'default' },
        childrenSlot: true,
    },
    input: {
        componentName: 'Input',
        importPath: '@/components/ui/input',
        imports: ['Input'],
        wrapperTag: 'Input',
        defaultProps: { type: 'text' },
        childrenSlot: false,
    },
    textarea: {
        componentName: 'Textarea',
        importPath: '@/components/ui/textarea',
        imports: ['Textarea'],
        wrapperTag: 'Textarea',
        childrenSlot: false,
    },
    select: {
        componentName: 'Select',
        importPath: '@/components/ui/select',
        imports: ['Select', 'SelectContent', 'SelectItem', 'SelectTrigger', 'SelectValue'],
        wrapperTag: 'Select',
        childrenSlot: true,
    },
    checkbox: {
        componentName: 'Checkbox',
        importPath: '@/components/ui/checkbox',
        imports: ['Checkbox'],
        wrapperTag: 'Checkbox',
        childrenSlot: false,
    },
    switch: {
        componentName: 'Switch',
        importPath: '@/components/ui/switch',
        imports: ['Switch'],
        wrapperTag: 'Switch',
        childrenSlot: false,
    },
    card: {
        componentName: 'Card',
        importPath: '@/components/ui/card',
        imports: ['Card', 'CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter'],
        wrapperTag: 'Card',
        childrenSlot: true,
    },
    dialog: {
        componentName: 'Dialog',
        importPath: '@/components/ui/dialog',
        imports: ['Dialog', 'DialogContent', 'DialogDescription', 'DialogHeader', 'DialogTitle', 'DialogTrigger'],
        wrapperTag: 'Dialog',
        childrenSlot: true,
    },
    avatar: {
        componentName: 'Avatar',
        importPath: '@/components/ui/avatar',
        imports: ['Avatar', 'AvatarFallback', 'AvatarImage'],
        wrapperTag: 'Avatar',
        childrenSlot: true,
    },
    badge: {
        componentName: 'Badge',
        importPath: '@/components/ui/badge',
        imports: ['Badge'],
        wrapperTag: 'Badge',
        defaultProps: { variant: 'default' },
        childrenSlot: true,
    },
    alert: {
        componentName: 'Alert',
        importPath: '@/components/ui/alert',
        imports: ['Alert', 'AlertDescription', 'AlertTitle'],
        wrapperTag: 'Alert',
        childrenSlot: true,
    },
    tooltip: {
        componentName: 'Tooltip',
        importPath: '@/components/ui/tooltip',
        imports: ['Tooltip', 'TooltipContent', 'TooltipProvider', 'TooltipTrigger'],
        wrapperTag: 'TooltipProvider',
        childrenSlot: true,
    },
    tabs: {
        componentName: 'Tabs',
        importPath: '@/components/ui/tabs',
        imports: ['Tabs', 'TabsContent', 'TabsList', 'TabsTrigger'],
        wrapperTag: 'Tabs',
        childrenSlot: true,
    },
    accordion: {
        componentName: 'Accordion',
        importPath: '@/components/ui/accordion',
        imports: ['Accordion', 'AccordionContent', 'AccordionItem', 'AccordionTrigger'],
        wrapperTag: 'Accordion',
        defaultProps: { type: 'single', collapsible: 'true' },
        childrenSlot: true,
    },
    table: {
        componentName: 'Table',
        importPath: '@/components/ui/table',
        imports: ['Table', 'TableBody', 'TableCell', 'TableHead', 'TableHeader', 'TableRow'],
        wrapperTag: 'Table',
        childrenSlot: true,
    },
    label: {
        componentName: 'Label',
        importPath: '@/components/ui/label',
        imports: ['Label'],
        wrapperTag: 'Label',
        childrenSlot: true,
    },
    divider: {
        componentName: 'Separator',
        importPath: '@/components/ui/separator',
        imports: ['Separator'],
        wrapperTag: 'Separator',
        childrenSlot: false,
    },
};

export function getShadcnReactMapping(type: IRComponentType): ShadcnMapping | null {
    return SHADCN_REACT_MAP[type] ?? null;
}

export function getAllShadcnReactImports(types: IRComponentType[]): Map<string, string[]> {
    const importMap = new Map<string, string[]>();

    for (const type of types) {
        const mapping = SHADCN_REACT_MAP[type];
        if (mapping) {
            const existing = importMap.get(mapping.importPath) ?? [];
            const merged = [...new Set([...existing, ...mapping.imports])];
            importMap.set(mapping.importPath, merged);
        }
    }

    return importMap;
}
