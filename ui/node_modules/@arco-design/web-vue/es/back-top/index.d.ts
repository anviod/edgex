import type { App } from 'vue';
import type { ArcoOptions } from '../_utils/types';
import _BackTop from './back-top';
declare const BackTop: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        visibleHeight: {
            type: import("vue").PropType<number>;
            default: number;
        };
        targetContainer: {
            type: import("vue").PropType<string | HTMLElement>;
        };
        easing: {
            type: StringConstructor;
            default: string;
        };
        duration: {
            type: NumberConstructor;
            default: number;
        };
    }>> & Readonly<{}>, {
        prefixCls: string;
        visible: import("vue").Ref<boolean, boolean>;
        scrollToTop: () => void;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        duration: number;
        visibleHeight: number;
        easing: string;
    }, true, {}, {}, {
        IconToTop: any;
    } & import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        visibleHeight: {
            type: import("vue").PropType<number>;
            default: number;
        };
        targetContainer: {
            type: import("vue").PropType<string | HTMLElement>;
        };
        easing: {
            type: StringConstructor;
            default: string;
        };
        duration: {
            type: NumberConstructor;
            default: number;
        };
    }>> & Readonly<{}>, {
        prefixCls: string;
        visible: import("vue").Ref<boolean, boolean>;
        scrollToTop: () => void;
    }, {}, {}, {}, {
        duration: number;
        visibleHeight: number;
        easing: string;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    visibleHeight: {
        type: import("vue").PropType<number>;
        default: number;
    };
    targetContainer: {
        type: import("vue").PropType<string | HTMLElement>;
    };
    easing: {
        type: StringConstructor;
        default: string;
    };
    duration: {
        type: NumberConstructor;
        default: number;
    };
}>> & Readonly<{}>, {
    prefixCls: string;
    visible: import("vue").Ref<boolean, boolean>;
    scrollToTop: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    duration: number;
    visibleHeight: number;
    easing: string;
}, {}, string, {}, {
    IconToTop: any;
} & import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    install: (app: App, options?: ArcoOptions | undefined) => void;
};
export declare type BackTopInstance = InstanceType<typeof _BackTop>;
export default BackTop;
