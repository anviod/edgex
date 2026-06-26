declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    value: {
        type: (ObjectConstructor | StringConstructor | NumberConstructor)[];
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    active: BooleanConstructor;
    uninjectContext: BooleanConstructor;
}>, {
    prefixCls: string;
    cls: import("vue").ComputedRef<(string | {
        [x: string]: boolean;
    })[]>;
    liRef: import("vue").Ref<HTMLElement | undefined, HTMLElement | undefined>;
    handleClick: (ev: MouseEvent) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (ev: MouseEvent) => true;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    value: {
        type: (ObjectConstructor | StringConstructor | NumberConstructor)[];
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    active: BooleanConstructor;
    uninjectContext: BooleanConstructor;
}>> & Readonly<{
    onClick?: ((ev: MouseEvent) => any) | undefined;
}>, {
    disabled: boolean;
    active: boolean;
    uninjectContext: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
