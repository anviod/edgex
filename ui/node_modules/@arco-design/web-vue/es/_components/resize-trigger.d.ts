import { PropType } from 'vue';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
export default _default;
