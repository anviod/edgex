declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    pages: {
        type: NumberConstructor;
        required: true;
    };
    current: {
        type: NumberConstructor;
        required: true;
    };
    type: {
        type: StringConstructor;
        required: true;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    simple: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, {
    prefixCls: string;
    cls: import("vue").ComputedRef<(string | {
        [x: string]: boolean;
    })[]>;
    isNext: boolean;
    handleClick: (e: MouseEvent) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "click"[], "click", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    pages: {
        type: NumberConstructor;
        required: true;
    };
    current: {
        type: NumberConstructor;
        required: true;
    };
    type: {
        type: StringConstructor;
        required: true;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    simple: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{
    onClick?: ((...args: any[]) => any) | undefined;
}>, {
    disabled: boolean;
    simple: boolean;
}, {}, {
    IconLeft: any;
    IconRight: any;
}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
