declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    author: {
        type: StringConstructor;
    };
    avatar: {
        type: StringConstructor;
    };
    content: {
        type: StringConstructor;
    };
    datetime: {
        type: StringConstructor;
    };
    align: {
        type: (ObjectConstructor | StringConstructor)[];
        default: string;
    };
}>, {
    prefixCls: string;
    hasAuthor: import("vue").ComputedRef<boolean>;
    hasAvatar: import("vue").ComputedRef<boolean>;
    hasContent: import("vue").ComputedRef<boolean>;
    hasDatetime: import("vue").ComputedRef<boolean>;
    computedAlign: import("vue").ComputedRef<{
        [x: string]: any;
    }>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    author: {
        type: StringConstructor;
    };
    avatar: {
        type: StringConstructor;
    };
    content: {
        type: StringConstructor;
    };
    datetime: {
        type: StringConstructor;
    };
    align: {
        type: (ObjectConstructor | StringConstructor)[];
        default: string;
    };
}>> & Readonly<{}>, {
    align: string | Record<string, any>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
