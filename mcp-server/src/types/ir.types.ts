// ─── Intermediate Representation ───
// A clean, framework-agnostic tree that the parser produces from raw Figma JSON.

export type IRComponentType =
    | 'button'
    | 'input'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'switch'
    | 'card'
    | 'dialog'
    | 'modal'
    | 'avatar'
    | 'badge'
    | 'alert'
    | 'tooltip'
    | 'dropdown'
    | 'tabs'
    | 'accordion'
    | 'table'
    | 'navbar'
    | 'sidebar'
    | 'footer'
    | 'hero'
    | 'icon'
    | 'image'
    | 'divider'
    | 'label'
    | 'link'
    | 'container'
    | 'text'
    | 'unknown';

export type IRLayoutDirection = 'horizontal' | 'vertical' | 'wrap' | 'none';

export type IRAlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

export type IRJustifyContent = 'start' | 'center' | 'end' | 'between';

export interface IRSpacing {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface IRBorderRadius {
    topLeft: number;
    topRight: number;
    bottomRight: number;
    bottomLeft: number;
}

export interface IRColor {
    r: number;
    g: number;
    b: number;
    a: number;
    hex: string;
}

export interface IRGradientStop {
    position: number;
    color: IRColor;
}

export interface IRFill {
    type: 'solid' | 'gradient-linear' | 'gradient-radial' | 'image';
    color?: IRColor;
    gradientStops?: IRGradientStop[];
    gradientAngle?: number;
    imageRef?: string;
}

export interface IRShadow {
    type: 'drop' | 'inner';
    color: IRColor;
    offsetX: number;
    offsetY: number;
    blur: number;
    spread: number;
}

export interface IRBorder {
    color: IRColor;
    width: number;
    style: 'solid' | 'dashed' | 'dotted';
}

export interface IRTextStyle {
    fontFamily: string;
    fontWeight: number;
    fontSize: number;
    lineHeight: number;
    letterSpacing: number;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
    textDecoration?: 'underline' | 'line-through' | 'none';
    italic: boolean;
}

export interface IRDimensions {
    width: number | 'auto' | 'fill';
    height: number | 'auto' | 'fill';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
}

export interface IRLayout {
    direction: IRLayoutDirection;
    alignItems: IRAlignItems;
    justifyContent: IRJustifyContent;
    gap: number;
    padding: IRSpacing;
    wrap: boolean;
}

export interface IRNode {
    id: string;
    name: string;
    componentType: IRComponentType;
    visible: boolean;

    // Visual
    fills: IRFill[];
    borders: IRBorder[];
    shadows: IRShadow[];
    borderRadius: IRBorderRadius;
    opacity: number;
    clipContent: boolean;

    // Layout
    layout: IRLayout;
    dimensions: IRDimensions;

    // Text
    textContent?: string;
    textStyle?: IRTextStyle;

    // Image (populated after Figma image export)
    imageUrl?: string;

    // Interactive hints (derived from component name heuristics)
    isInteractive: boolean;
    interactivityHint?: 'click' | 'input' | 'toggle' | 'navigation';

    // Children
    children: IRNode[];
}

export interface IRDesignTree {
    fileName: string;
    lastModified: string;
    rootNode: IRNode;
    componentMap: Record<string, string>; // figmaComponentId → componentName
}
