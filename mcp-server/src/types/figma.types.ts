// ─── Figma REST API Response Types ───

export interface FigmaColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface FigmaFill {
    type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND' | 'IMAGE' | 'EMOJI';
    visible?: boolean;
    opacity?: number;
    color?: FigmaColor;
    gradientHandlePositions?: FigmaVector[];
    gradientStops?: FigmaColorStop[];
    scaleMode?: string;
    imageRef?: string;
}

export interface FigmaColorStop {
    position: number;
    color: FigmaColor;
}

export interface FigmaVector {
    x: number;
    y: number;
}

export interface FigmaStroke {
    type: string;
    visible?: boolean;
    color?: FigmaColor;
    opacity?: number;
}

export interface FigmaEffect {
    type: 'INNER_SHADOW' | 'DROP_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';
    visible: boolean;
    radius: number;
    color?: FigmaColor;
    offset?: FigmaVector;
    spread?: number;
}

export interface FigmaConstraint {
    type: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'SCALE';
    value: number;
}

export interface FigmaLayoutConstraint {
    vertical: 'TOP' | 'BOTTOM' | 'CENTER' | 'TOP_BOTTOM' | 'SCALE';
    horizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'LEFT_RIGHT' | 'SCALE';
}

export interface FigmaTypeStyle {
    fontFamily: string;
    fontPostScriptName?: string;
    fontWeight: number;
    fontSize: number;
    textAlignHorizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'JUSTIFIED';
    textAlignVertical: 'TOP' | 'CENTER' | 'BOTTOM';
    letterSpacing: number;
    lineHeightPx: number;
    lineHeightPercent?: number;
    lineHeightUnit?: string;
    textCase?: 'UPPER' | 'LOWER' | 'TITLE' | 'SMALL_CAPS' | 'SMALL_CAPS_FORCED';
    textDecoration?: 'NONE' | 'STRIKETHROUGH' | 'UNDERLINE';
    italic?: boolean;
}

export type FigmaNodeType =
    | 'DOCUMENT'
    | 'CANVAS'
    | 'FRAME'
    | 'GROUP'
    | 'SECTION'
    | 'VECTOR'
    | 'BOOLEAN_OPERATION'
    | 'STAR'
    | 'LINE'
    | 'ELLIPSE'
    | 'REGULAR_POLYGON'
    | 'RECTANGLE'
    | 'TEXT'
    | 'SLICE'
    | 'COMPONENT'
    | 'COMPONENT_SET'
    | 'INSTANCE'
    | 'STICKY'
    | 'SHAPE_WITH_TEXT'
    | 'CONNECTOR'
    | 'TABLE'
    | 'TABLE_CELL'
    | 'WIDGET'
    | 'EMBED'
    | 'LINK_UNFURL';

export interface FigmaNode {
    id: string;
    name: string;
    type: FigmaNodeType;
    visible?: boolean;
    children?: FigmaNode[];

    // Geometry
    absoluteBoundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    absoluteRenderBounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };

    // Style
    fills?: FigmaFill[];
    strokes?: FigmaStroke[];
    strokeWeight?: number;
    strokeAlign?: 'INSIDE' | 'OUTSIDE' | 'CENTER';
    effects?: FigmaEffect[];
    opacity?: number;
    cornerRadius?: number;
    rectangleCornerRadii?: [number, number, number, number];

    // Layout
    constraints?: FigmaLayoutConstraint;
    layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
    primaryAxisSizingMode?: 'FIXED' | 'AUTO';
    counterAxisSizingMode?: 'FIXED' | 'AUTO';
    primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
    counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'BASELINE';
    layoutWrap?: 'NO_WRAP' | 'WRAP';
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
    itemSpacing?: number;
    counterAxisSpacing?: number;

    // Dimensions
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    layoutSizingHorizontal?: 'FIXED' | 'HUG' | 'FILL';
    layoutSizingVertical?: 'FIXED' | 'HUG' | 'FILL';

    // Text
    characters?: string;
    style?: FigmaTypeStyle;

    // Component
    componentId?: string;
    componentProperties?: Record<string, {
        type: string;
        value: string | boolean;
    }>;

    // Blend
    blendMode?: string;
    clipsContent?: boolean;
    isMask?: boolean;
}

export interface FigmaFileNodesResponse {
    name: string;
    lastModified: string;
    thumbnailUrl: string;
    version: string;
    nodes: Record<string, {
        document: FigmaNode;
        components: Record<string, FigmaComponentMeta>;
        styles: Record<string, FigmaStyleMeta>;
    }>;
}

export interface FigmaComponentMeta {
    key: string;
    name: string;
    description: string;
    documentationLinks?: { uri: string }[];
}

export interface FigmaStyleMeta {
    key: string;
    name: string;
    styleType: 'FILL' | 'TEXT' | 'EFFECT' | 'GRID';
    description: string;
}
