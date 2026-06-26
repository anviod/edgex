declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    current: {
        type: NumberConstructor;
        required: true;
    };
    step: {
        type: NumberConstructor;
        default: number;
    };
    pages: {
        type: NumberConstructor;
        required: true;
    };
}>, {
    prefixCls: string;
    cls: import("vue").ComputedRef<string[]>;
    handleClick: (e: MouseEvent) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "click"[], "click", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    current: {
        type: NumberConstructor;
        required: true;
    };
    step: {
        type: NumberConstructor;
        default: number;
    };
    pages: {
        type: NumberConstructor;
        required: true;
    };
}>> & Readonly<{
    onClick?: ((...args: any[]) => any) | undefined;
}>, {
    step: number;
}, {}, {
    IconMore: any;
}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
