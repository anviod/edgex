import type { PropType } from 'vue';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    visibleHeight: {
        type: PropType<number>;
        default: number;
    };
    targetContainer: {
        type: PropType<string | HTMLElement>;
    };
    easing: {
        type: StringConstructor;
        default: string;
    };
    duration: {
        type: NumberConstructor;
        default: number;
    };
}>, {
    prefixCls: string;
    visible: import("vue").Ref<boolean, boolean>;
    scrollToTop: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    visibleHeight: {
        type: PropType<number>;
        default: number;
    };
    targetContainer: {
        type: PropType<string | HTMLElement>;
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
    duration: number;
    visibleHeight: number;
    easing: string;
}, {}, {
    IconToTop: any;
}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
