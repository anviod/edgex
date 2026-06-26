export declare function fixedWidth(width: number): Record<string, unknown>;
export declare function setTransformStyle(value: string): Record<string, unknown>;
export declare function getStyle(element: HTMLElement | null, prop: string | null): string | number | ((index: number) => string) | CSSRule | ((property: string, value: string | null, priority?: string | undefined) => void) | null;
