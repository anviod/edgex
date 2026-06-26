import type { CSSProperties, PropType, Ref } from 'vue';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    offsetTop: {
        type: NumberConstructor;
        default: number;
    };
    offsetBottom: {
        type: NumberConstructor;
    };
    target: {
        type: PropType<string | Window | HTMLElement>;
    };
    targetContainer: {
        type: PropType<string | Window | HTMLElement>;
    };
}>, {
    wrapperRef: Ref<HTMLElement | undefined, HTMLElement | undefined>;
    isFixed: Ref<boolean, boolean>;
    classNames: import("vue").ComputedRef<{
        [x: string]: boolean;
    }>;
    placeholderStyles: Ref<CSSProperties, CSSProperties>;
    fixedStyles: Ref<CSSProperties, CSSProperties>;
    updatePositionThrottle: {
        (...args: any[]): void;
        cancel(): void;
    };
}, {}, {}, {
    updatePosition(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (fixed: boolean) => true;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    offsetTop: {
        type: NumberConstructor;
        default: number;
    };
    offsetBottom: {
        type: NumberConstructor;
    };
    target: {
        type: PropType<string | Window | HTMLElement>;
    };
    targetContainer: {
        type: PropType<string | Window | HTMLElement>;
    };
}>> & Readonly<{
    onChange?: ((fixed: boolean) => any) | undefined;
}>, {
    offsetTop: number;
}, {}, {
    ResizeObserver: import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | null, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "resize"[], "resize", import("vue").PublicProps, Readonly<{}> & Readonly<{
        onResize?: ((...args: any[]) => any) | undefined;
    }>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
