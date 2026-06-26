import { VNode } from 'vue';
export declare const NOOP: () => undefined;
export interface Size {
    height: number;
    width: number;
}
export declare const getDocumentSize: () => Size;
export declare const isServerRendering: boolean;
export declare const on: <K extends keyof HTMLElementEventMap>(element: HTMLElement | Window, event: K, handler: (ev: HTMLElementEventMap[K]) => void, options?: boolean | AddEventListenerOptions) => void;
export declare const off: <K extends keyof HTMLElementEventMap>(element: HTMLElement | Window, type: K, handler: (ev: HTMLElementEventMap[K]) => void, options?: boolean | EventListenerOptions) => void;
export declare const findDomNode: (vnode: VNode) => HTMLElement;
export declare const contains: (root: Node | null | undefined, ele: Node | null) => boolean;
export declare const OVERLAY_TYPES: readonly ["modal", "message", "notification", "drawer"];
export declare const getOverlay: (type: typeof OVERLAY_TYPES[number]) => HTMLDivElement;
export declare const querySelector: (selectors: string, container?: Document | HTMLElement | undefined) => HTMLElement | undefined;
export declare const getElement: (target: string | HTMLElement | undefined, container?: Document | HTMLElement | undefined) => HTMLElement | undefined;
export declare const getRelativeRect: (target: HTMLElement, relative: HTMLElement) => {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
};
export declare const isScroll: (element: HTMLElement) => boolean;
export declare const getScrollBarWidth: (element: HTMLElement) => number;
