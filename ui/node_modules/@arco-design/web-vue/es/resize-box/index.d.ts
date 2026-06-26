import { App } from 'vue';
import type { ArcoOptions } from '../_utils/types';
import _ResizeBox from './resize-box';
declare const ResizeBox: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
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
            type: import("vue").PropType<("top" | "bottom" | "left" | "right")[]>;
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
        onMoveStart: (direction: import("./resize-box").DirectionType, e: MouseEvent) => void;
        isHorizontal: (direction: import("./resize-box").DirectionType) => boolean;
        allowDirections: import("vue").ComputedRef<("top" | "bottom" | "left" | "right")[]>;
        onTiggerResize: (direction: import("./resize-box").DirectionType, entry: ResizeObserverEntry) => void;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        'update:width': (width: number) => true;
        'update:height': (height: number) => true;
        movingStart: (ev: MouseEvent) => true;
        moving: (size: {
            width: number;
            height: number;
        }, ev: MouseEvent) => true;
        movingEnd: (ev: MouseEvent) => true;
    }, import("vue").PublicProps, {
        component: string;
        directions: ("top" | "bottom" | "left" | "right")[];
    }, true, {}, {}, {
        ResizeTrigger: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
            prefixCls: {
                type: StringConstructor;
                required: true;
            };
            direction: {
                type: import("vue").PropType<"horizontal" | "vertical">;
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
                type: import("vue").PropType<"horizontal" | "vertical">;
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
    } & import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
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
            type: import("vue").PropType<("top" | "bottom" | "left" | "right")[]>;
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
        onMoveStart: (direction: import("./resize-box").DirectionType, e: MouseEvent) => void;
        isHorizontal: (direction: import("./resize-box").DirectionType) => boolean;
        allowDirections: import("vue").ComputedRef<("top" | "bottom" | "left" | "right")[]>;
        onTiggerResize: (direction: import("./resize-box").DirectionType, entry: ResizeObserverEntry) => void;
    }, {}, {}, {}, {
        component: string;
        directions: ("top" | "bottom" | "left" | "right")[];
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
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
        type: import("vue").PropType<("top" | "bottom" | "left" | "right")[]>;
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
    onMoveStart: (direction: import("./resize-box").DirectionType, e: MouseEvent) => void;
    isHorizontal: (direction: import("./resize-box").DirectionType) => boolean;
    allowDirections: import("vue").ComputedRef<("top" | "bottom" | "left" | "right")[]>;
    onTiggerResize: (direction: import("./resize-box").DirectionType, entry: ResizeObserverEntry) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'update:width': (width: number) => true;
    'update:height': (height: number) => true;
    movingStart: (ev: MouseEvent) => true;
    moving: (size: {
        width: number;
        height: number;
    }, ev: MouseEvent) => true;
    movingEnd: (ev: MouseEvent) => true;
}, string, {
    component: string;
    directions: ("top" | "bottom" | "left" | "right")[];
}, {}, string, {}, {
    ResizeTrigger: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        prefixCls: {
            type: StringConstructor;
            required: true;
        };
        direction: {
            type: import("vue").PropType<"horizontal" | "vertical">;
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
            type: import("vue").PropType<"horizontal" | "vertical">;
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
} & import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    install: (app: App, options?: ArcoOptions | undefined) => void;
};
export declare type ResizeBoxInstance = InstanceType<typeof _ResizeBox>;
export default ResizeBox;
