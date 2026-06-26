import type { PropType, CSSProperties } from 'vue';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    pageNumber: {
        type: NumberConstructor;
    };
    current: {
        type: NumberConstructor;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    style: {
        type: PropType<CSSProperties>;
    };
    activeStyle: {
        type: PropType<CSSProperties>;
    };
}>, {
    prefixCls: string;
    cls: import("vue").ComputedRef<(string | {
        [x: string]: boolean;
    })[]>;
    mergedStyle: import("vue").ComputedRef<CSSProperties | undefined>;
    handleClick: (e: MouseEvent) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "click"[], "click", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    pageNumber: {
        type: NumberConstructor;
    };
    current: {
        type: NumberConstructor;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    style: {
        type: PropType<CSSProperties>;
    };
    activeStyle: {
        type: PropType<CSSProperties>;
    };
}>> & Readonly<{
    onClick?: ((...args: any[]) => any) | undefined;
}>, {
    disabled: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
