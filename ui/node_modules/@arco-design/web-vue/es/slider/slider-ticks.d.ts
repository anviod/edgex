import { PropType } from 'vue';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    value: {
        type: PropType<[number, number]>;
        required: true;
    };
    step: {
        type: NumberConstructor;
        required: true;
    };
    min: {
        type: NumberConstructor;
        required: true;
    };
    max: {
        type: NumberConstructor;
        required: true;
    };
    direction: {
        type: PropType<"horizontal" | "vertical">;
        default: string;
    };
}>, {
    prefixCls: string;
    steps: import("vue").ComputedRef<{
        key: number;
        isActive: boolean;
    }[]>;
    getStyle: (value: number) => import("vue").CSSProperties;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    value: {
        type: PropType<[number, number]>;
        required: true;
    };
    step: {
        type: NumberConstructor;
        required: true;
    };
    min: {
        type: NumberConstructor;
        required: true;
    };
    max: {
        type: NumberConstructor;
        required: true;
    };
    direction: {
        type: PropType<"horizontal" | "vertical">;
        default: string;
    };
}>> & Readonly<{}>, {
    direction: "horizontal" | "vertical";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
