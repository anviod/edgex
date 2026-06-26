declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    steps: {
        type: NumberConstructor;
        default: number;
    };
    percent: {
        type: NumberConstructor;
        default: number;
    };
    size: {
        type: StringConstructor;
    };
    color: {
        type: (ObjectConstructor | StringConstructor)[];
        default: undefined;
    };
    trackColor: StringConstructor;
    strokeWidth: {
        type: NumberConstructor;
    };
    status: {
        type: StringConstructor;
        default: undefined;
    };
    showText: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, {
    prefixCls: string;
    stepList: import("vue").ComputedRef<boolean[]>;
    mergedStrokeWidth: import("vue").ComputedRef<4 | 8>;
    text: import("vue").ComputedRef<string>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    steps: {
        type: NumberConstructor;
        default: number;
    };
    percent: {
        type: NumberConstructor;
        default: number;
    };
    size: {
        type: StringConstructor;
    };
    color: {
        type: (ObjectConstructor | StringConstructor)[];
        default: undefined;
    };
    trackColor: StringConstructor;
    strokeWidth: {
        type: NumberConstructor;
    };
    status: {
        type: StringConstructor;
        default: undefined;
    };
    showText: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, {
    color: string | Record<string, any>;
    status: string;
    showText: boolean;
    steps: number;
    percent: number;
}, {}, {
    IconExclamationCircleFill: any;
}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
