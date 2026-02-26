// ─── Spartan UI (Angular / shadcn equivalent) Component Mapper ───

import type { IRComponentType } from '../types/ir.types.js';

export interface SpartanMapping {
    componentName: string;
    importPackage: string;
    directives: string[];
    selector: string;
    defaultProps?: Record<string, string>;
    childrenSlot: boolean;
}

const SPARTAN_MAP: Partial<Record<IRComponentType, SpartanMapping>> = {
    button: {
        componentName: 'HlmButtonDirective',
        importPackage: '@spartan-ng/ui-button-helm',
        directives: ['HlmButtonDirective'],
        selector: 'button hlmBtn',
        defaultProps: { variant: 'default' },
        childrenSlot: true,
    },
    input: {
        componentName: 'HlmInputDirective',
        importPackage: '@spartan-ng/ui-input-helm',
        directives: ['HlmInputDirective'],
        selector: 'input hlmInput',
        defaultProps: { type: 'text' },
        childrenSlot: false,
    },
    textarea: {
        componentName: 'HlmInputDirective',
        importPackage: '@spartan-ng/ui-input-helm',
        directives: ['HlmInputDirective'],
        selector: 'textarea hlmInput',
        childrenSlot: false,
    },
    checkbox: {
        componentName: 'BrnCheckboxComponent',
        importPackage: '@spartan-ng/ui-checkbox-brain',
        directives: ['BrnCheckboxComponent', 'HlmCheckboxDirective'],
        selector: 'brn-checkbox',
        childrenSlot: false,
    },
    switch: {
        componentName: 'BrnSwitchComponent',
        importPackage: '@spartan-ng/ui-switch-brain',
        directives: ['BrnSwitchComponent', 'HlmSwitchDirective'],
        selector: 'brn-switch',
        childrenSlot: false,
    },
    card: {
        componentName: 'HlmCardDirective',
        importPackage: '@spartan-ng/ui-card-helm',
        directives: [
            'HlmCardDirective', 'HlmCardHeaderDirective', 'HlmCardTitleDirective',
            'HlmCardDescriptionDirective', 'HlmCardContentDirective', 'HlmCardFooterDirective',
        ],
        selector: 'section hlmCard',
        childrenSlot: true,
    },
    dialog: {
        componentName: 'BrnDialogComponent',
        importPackage: '@spartan-ng/ui-dialog-brain',
        directives: [
            'BrnDialogTriggerDirective', 'BrnDialogContentDirective',
            'HlmDialogComponent', 'HlmDialogHeaderComponent', 'HlmDialogTitleDirective',
        ],
        selector: 'hlm-dialog',
        childrenSlot: true,
    },
    avatar: {
        componentName: 'HlmAvatarComponent',
        importPackage: '@spartan-ng/ui-avatar-helm',
        directives: ['HlmAvatarComponent', 'HlmAvatarImageDirective', 'HlmAvatarFallbackDirective'],
        selector: 'hlm-avatar',
        childrenSlot: true,
    },
    badge: {
        componentName: 'HlmBadgeDirective',
        importPackage: '@spartan-ng/ui-badge-helm',
        directives: ['HlmBadgeDirective'],
        selector: 'span hlmBadge',
        defaultProps: { variant: 'default' },
        childrenSlot: true,
    },
    alert: {
        componentName: 'HlmAlertDirective',
        importPackage: '@spartan-ng/ui-alert-helm',
        directives: ['HlmAlertDirective', 'HlmAlertTitleDirective', 'HlmAlertDescriptionDirective'],
        selector: 'section hlmAlert',
        childrenSlot: true,
    },
    tabs: {
        componentName: 'BrnTabsComponent',
        importPackage: '@spartan-ng/ui-tabs-brain',
        directives: [
            'BrnTabsComponent', 'BrnTabsListComponent', 'BrnTabsTriggerDirective', 'BrnTabsContentDirective',
            'HlmTabsListComponent', 'HlmTabsTriggerDirective', 'HlmTabsContentDirective',
        ],
        selector: 'brn-tabs',
        childrenSlot: true,
    },
    accordion: {
        componentName: 'BrnAccordionComponent',
        importPackage: '@spartan-ng/ui-accordion-brain',
        directives: [
            'BrnAccordionComponent', 'BrnAccordionItemComponent',
            'BrnAccordionTriggerComponent', 'BrnAccordionContentComponent',
            'HlmAccordionDirective', 'HlmAccordionItemDirective',
        ],
        selector: 'brn-accordion',
        childrenSlot: true,
    },
    table: {
        componentName: 'HlmTableComponent',
        importPackage: '@spartan-ng/ui-table-helm',
        directives: [
            'HlmTableComponent', 'HlmTrowComponent', 'HlmThComponent',
            'HlmTdComponent', 'HlmCaptionComponent',
        ],
        selector: 'hlm-table',
        childrenSlot: true,
    },
    label: {
        componentName: 'HlmLabelDirective',
        importPackage: '@spartan-ng/ui-label-helm',
        directives: ['HlmLabelDirective'],
        selector: 'label hlmLabel',
        childrenSlot: true,
    },
    divider: {
        componentName: 'HlmSeparatorDirective',
        importPackage: '@spartan-ng/ui-separator-helm',
        directives: ['HlmSeparatorDirective'],
        selector: 'brn-separator',
        childrenSlot: false,
    },
};

export function getSpartanMapping(type: IRComponentType): SpartanMapping | null {
    return SPARTAN_MAP[type] ?? null;
}

export function getAllSpartanImports(types: IRComponentType[]): Map<string, string[]> {
    const importMap = new Map<string, string[]>();

    for (const type of types) {
        const mapping = SPARTAN_MAP[type];
        if (mapping) {
            const existing = importMap.get(mapping.importPackage) ?? [];
            const merged = [...new Set([...existing, ...mapping.directives])];
            importMap.set(mapping.importPackage, merged);
        }
    }

    return importMap;
}
