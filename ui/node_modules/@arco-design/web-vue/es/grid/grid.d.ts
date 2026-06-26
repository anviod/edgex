import { PropType } from 'vue';
import { ResponsiveValue } from './interface';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    cols: {
        type: PropType<number | ResponsiveValue>;
        default: number;
    };
    rowGap: {
        type: PropType<number | ResponsiveValue>;
        default: number;
    };
    colGap: {
        type: PropType<number | ResponsiveValue>;
        default: number;
    };
    collapsed: {
        type: BooleanConstructor;
        default: boolean;
    };
    collapsedRows: {
        type: NumberConstructor;
        default: number;
    };
}>, {
    classNames: import("vue").ComputedRef<string[]>;
    style: import("vue").ComputedRef<{
        gap: string;
        'grid-template-columns': string;
    }[]>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    cols: {
        type: PropType<number | ResponsiveValue>;
        default: number;
    };
    rowGap: {
        type: PropType<number | ResponsiveValue>;
        default: number;
    };
    colGap: {
        type: PropType<number | ResponsiveValue>;
        default: number;
    };
    collapsed: {
        type: BooleanConstructor;
        default: boolean;
    };
    collapsedRows: {
        type: NumberConstructor;
        default: number;
    };
}>> & Readonly<{}>, {
    rowGap: number | ResponsiveValue;
    cols: number | ResponsiveValue;
    colGap: number | ResponsiveValue;
    collapsed: boolean;
    collapsedRows: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
