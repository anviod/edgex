import { PropType } from 'vue';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    activeKey: {
        type: PropType<(string | number)[]>;
        default: undefined;
    };
    defaultActiveKey: {
        type: PropType<(string | number)[]>;
        default: () => never[];
    };
    accordion: {
        type: BooleanConstructor;
        default: boolean;
    };
    showExpandIcon: {
        type: BooleanConstructor;
        default: undefined;
    };
    expandIconPosition: {
        type: PropType<"left" | "right">;
        default: string;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    destroyOnHide: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, {
    prefixCls: string;
    cls: import("vue").ComputedRef<(string | {
        [x: string]: boolean;
    })[]>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'update:activeKey': (activeKey: (string | number)[]) => true;
    change: (activeKey: (string | number)[], ev: Event) => true;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    activeKey: {
        type: PropType<(string | number)[]>;
        default: undefined;
    };
    defaultActiveKey: {
        type: PropType<(string | number)[]>;
        default: () => never[];
    };
    accordion: {
        type: BooleanConstructor;
        default: boolean;
    };
    showExpandIcon: {
        type: BooleanConstructor;
        default: undefined;
    };
    expandIconPosition: {
        type: PropType<"left" | "right">;
        default: string;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    destroyOnHide: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{
    onChange?: ((activeKey: (string | number)[], ev: Event) => any) | undefined;
    "onUpdate:activeKey"?: ((activeKey: (string | number)[]) => any) | undefined;
}>, {
    bordered: boolean;
    activeKey: (string | number)[];
    defaultActiveKey: (string | number)[];
    accordion: boolean;
    showExpandIcon: boolean;
    expandIconPosition: "left" | "right";
    destroyOnHide: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
