import { PropType } from 'vue';
export declare type DirectionType = 'left' | 'right' | 'top' | 'bottom';
declare function isHorizontal(direction: DirectionType): boolean;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    width: {
        type: NumberConstructor;
    };
    height: {
        type: NumberConstructor;
    };
    component: {
        type: StringConstructor;
        default: string;
    };
    directions: {
        type: PropType<("top" | "bottom" | "left" | "right")[]>;
        default: () => string[];
    };
}>, {
    prefixCls: string;
    classNames: import("vue").ComputedRef<string[]>;
    styles: import("vue").ComputedRef<{
        "padding-left"?: string | undefined;
        "padding-right"?: string | undefined;
        "padding-top"?: string | undefined;
        "padding-bottom"?: string | undefined;
        height?: string | undefined;
        width?: string | undefined;
    }>;
    wrapperRef: import("vue").Ref<HTMLDivElement | undefined, HTMLDivElement | undefined>;
    onMoveStart: (direction: DirectionType, e: MouseEvent) => void;
    isHorizontal: typeof isHorizontal;
    allowDirections: import("vue").ComputedRef<("top" | "bottom" | "left" | "right")[]>;
    onTiggerResize: (direction: DirectionType, entry: ResizeObserverEntry) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'update:width': (width: number) => true;
    'update:height': (height: number) => true;
    movingStart: (ev: MouseEvent) => true;
    moving: (size: {
        width: number;
        height: number;
    }, ev: MouseEvent) => true;
    movingEnd: (ev: MouseEvent) => true;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    width: {
        type: NumberConstructor;
    };
    height: {
        type: NumberConstructor;
    };
    component: {
        type: StringConstructor;
        default: string;
    };
    directions: {
        type: PropType<("top" | "bottom" | "left" | "right")[]>;
        default: () => string[];
    };
}>> & Readonly<{
    "onUpdate:width"?: ((width: number) => any) | undefined;
    "onUpdate:height"?: ((height: number) => any) | undefined;
    onMovingStart?: ((ev: MouseEvent) => any) | undefined;
    onMoving?: ((size: {
        width: number;
        height: number;
    }, ev: MouseEvent) => any) | undefined;
    onMovingEnd?: ((ev: MouseEvent) => any) | undefined;
}>, {
    component: string;
    directions: ("top" | "bottom" | "left" | "right")[];
}, {}, {
    ResizeTrigger: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        prefixCls: {
            type: StringConstructor;
            required: true;
        };
        direction: {
            type: PropType<"horizontal" | "vertical">;
            default: string;
        };
    }>, {
        classNames: import("vue").ComputedRef<(string | {
            [x: string]: boolean;
        })[]>;
        onResize: (entry: ResizeObserverEntry) => void;
        isHorizontal: import("vue").ComputedRef<boolean>;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "resize"[], "resize", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        prefixCls: {
            type: StringConstructor;
            required: true;
        };
        direction: {
            type: PropType<"horizontal" | "vertical">;
            default: string;
        };
    }>> & Readonly<{
        onResize?: ((...args: any[]) => any) | undefined;
    }>, {
        direction: "horizontal" | "vertical";
    }, {}, {
        ResizeObserver: import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }> | null, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "resize"[], "resize", import("vue").PublicProps, Readonly<{}> & Readonly<{
            onResize?: ((...args: any[]) => any) | undefined;
        }>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
        IconDragDot: any;
        IconDragDotVertical: any;
    }, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
