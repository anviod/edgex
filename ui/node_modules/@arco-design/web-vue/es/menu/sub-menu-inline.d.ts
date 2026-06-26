declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    title: {
        type: StringConstructor;
    };
    isChildrenSelected: {
        type: BooleanConstructor;
    };
}>, {
    prefixCls: import("vue").ComputedRef<string>;
    menuPrefixCls: import("vue").ComputedRef<string | undefined>;
    classNames: import("vue").ComputedRef<string[]>;
    level: import("vue").ComputedRef<number>;
    isSelected: import("vue").ComputedRef<boolean>;
    isOpen: import("vue").ComputedRef<boolean>;
    onHeaderClick: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    title: {
        type: StringConstructor;
    };
    isChildrenSelected: {
        type: BooleanConstructor;
    };
}>> & Readonly<{}>, {
    isChildrenSelected: boolean;
}, {}, {
    MenuIndent: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        level: {
            type: NumberConstructor;
            default: number;
        };
    }>, {
        prefixCls: string;
        levelIndent: import("vue").Ref<number | undefined, number | undefined>;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        level: {
            type: NumberConstructor;
            default: number;
        };
    }>> & Readonly<{}>, {
        level: number;
    }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    ExpandTransition: import("vue").DefineComponent<{}, {
        onBeforeEnter(el: HTMLDivElement): void;
        onEnter(el: HTMLDivElement): void;
        onAfterEnter(el: HTMLDivElement): void;
        onBeforeLeave(el: HTMLDivElement): void;
        onLeave(el: HTMLDivElement): void;
        onAfterLeave(el: HTMLElement): void;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
