import type { PropType, CSSProperties } from 'vue';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    rows: {
        type: NumberConstructor;
        default: number;
    };
    widths: {
        type: PropType<(string | number)[]>;
        default: () => never[];
    };
    lineHeight: {
        type: NumberConstructor;
        default: number;
    };
    lineSpacing: {
        type: NumberConstructor;
        default: number;
    };
}>, {
    prefixCls: string;
    lines: CSSProperties[];
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    rows: {
        type: NumberConstructor;
        default: number;
    };
    widths: {
        type: PropType<(string | number)[]>;
        default: () => never[];
    };
    lineHeight: {
        type: NumberConstructor;
        default: number;
    };
    lineSpacing: {
        type: NumberConstructor;
        default: number;
    };
}>> & Readonly<{}>, {
    lineHeight: number;
    rows: number;
    widths: (string | number)[];
    lineSpacing: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
