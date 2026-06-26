import { PropType } from 'vue';
import { ResponsiveValue } from './interface';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    span: {
        type: PropType<number | ResponsiveValue>;
        default: number;
    };
    offset: {
        type: PropType<number | ResponsiveValue>;
        default: number;
    };
    suffix: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, {
    classNames: import("vue").ComputedRef<string[]>;
    style: import("vue").ComputedRef<({
        'margin-left': string;
    } | {
        'margin-left'?: undefined;
    } | {
        'grid-column': string;
        display?: undefined;
    } | {
        display: string;
        'grid-column'?: undefined;
    })[]>;
    domRef: import("vue").Ref<HTMLDivElement | undefined, HTMLDivElement | undefined>;
    overflow: import("vue").ComputedRef<boolean>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    span: {
        type: PropType<number | ResponsiveValue>;
        default: number;
    };
    offset: {
        type: PropType<number | ResponsiveValue>;
        default: number;
    };
    suffix: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, {
    span: number | ResponsiveValue;
    offset: number | ResponsiveValue;
    suffix: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
