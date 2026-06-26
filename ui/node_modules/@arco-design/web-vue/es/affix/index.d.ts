import type { App } from 'vue';
import type { ArcoOptions } from '../_utils/types';
import _Affix from './affix';
declare const Affix: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        offsetTop: {
            type: NumberConstructor;
            default: number;
        };
        offsetBottom: {
            type: NumberConstructor;
        };
        target: {
            type: import("vue").PropType<string | Window | HTMLElement>;
        };
        targetContainer: {
            type: import("vue").PropType<string | Window | HTMLElement>;
        };
    }>> & Readonly<{
        onChange?: ((fixed: boolean) => any) | undefined;
    }>, {
        wrapperRef: import("vue").Ref<HTMLElement | undefined, HTMLElement | undefined>;
        isFixed: import("vue").Ref<boolean, boolean>;
        classNames: import("vue").ComputedRef<{
            [x: string]: boolean;
        }>;
        placeholderStyles: import("vue").Ref<import("vue").CSSProperties, import("vue").CSSProperties>;
        fixedStyles: import("vue").Ref<import("vue").CSSProperties, import("vue").CSSProperties>;
        updatePositionThrottle: {
            (...args: any[]): void;
            cancel(): void;
        };
    }, {}, {}, {
        updatePosition(): void;
    }, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        change: (fixed: boolean) => true;
    }, import("vue").PublicProps, {
        offsetTop: number;
    }, true, {}, {}, {
        ResizeObserver: import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }> | null, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "resize"[], "resize", import("vue").PublicProps, Readonly<{}> & Readonly<{
            onResize?: ((...args: any[]) => any) | undefined;
        }>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    } & import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        offsetTop: {
            type: NumberConstructor;
            default: number;
        };
        offsetBottom: {
            type: NumberConstructor;
        };
        target: {
            type: import("vue").PropType<string | Window | HTMLElement>;
        };
        targetContainer: {
            type: import("vue").PropType<string | Window | HTMLElement>;
        };
    }>> & Readonly<{
        onChange?: ((fixed: boolean) => any) | undefined;
    }>, {
        wrapperRef: import("vue").Ref<HTMLElement | undefined, HTMLElement | undefined>;
        isFixed: import("vue").Ref<boolean, boolean>;
        classNames: import("vue").ComputedRef<{
            [x: string]: boolean;
        }>;
        placeholderStyles: import("vue").Ref<import("vue").CSSProperties, import("vue").CSSProperties>;
        fixedStyles: import("vue").Ref<import("vue").CSSProperties, import("vue").CSSProperties>;
        updatePositionThrottle: {
            (...args: any[]): void;
            cancel(): void;
        };
    }, {}, {}, {
        updatePosition(): void;
    }, {
        offsetTop: number;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    offsetTop: {
        type: NumberConstructor;
        default: number;
    };
    offsetBottom: {
        type: NumberConstructor;
    };
    target: {
        type: import("vue").PropType<string | Window | HTMLElement>;
    };
    targetContainer: {
        type: import("vue").PropType<string | Window | HTMLElement>;
    };
}>> & Readonly<{
    onChange?: ((fixed: boolean) => any) | undefined;
}>, {
    wrapperRef: import("vue").Ref<HTMLElement | undefined, HTMLElement | undefined>;
    isFixed: import("vue").Ref<boolean, boolean>;
    classNames: import("vue").ComputedRef<{
        [x: string]: boolean;
    }>;
    placeholderStyles: import("vue").Ref<import("vue").CSSProperties, import("vue").CSSProperties>;
    fixedStyles: import("vue").Ref<import("vue").CSSProperties, import("vue").CSSProperties>;
    updatePositionThrottle: {
        (...args: any[]): void;
        cancel(): void;
    };
}, {}, {}, {
    updatePosition(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (fixed: boolean) => true;
}, string, {
    offsetTop: number;
}, {}, string, {}, {
    ResizeObserver: import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | null, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "resize"[], "resize", import("vue").PublicProps, Readonly<{}> & Readonly<{
        onResize?: ((...args: any[]) => any) | undefined;
    }>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
} & import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    install: (app: App, options?: ArcoOptions | undefined) => void;
};
export declare type AffixInstance = InstanceType<typeof _Affix>;
export default Affix;
