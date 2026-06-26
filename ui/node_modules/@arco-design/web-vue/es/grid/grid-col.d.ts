import { PropType } from 'vue';
import { FlexType } from './interface';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    span: {
        type: NumberConstructor;
        default: number;
    };
    offset: {
        type: NumberConstructor;
    };
    order: {
        type: NumberConstructor;
    };
    xs: {
        type: PropType<number | {
            [key: string]: any;
        }>;
    };
    sm: {
        type: PropType<number | {
            [key: string]: any;
        }>;
    };
    md: {
        type: PropType<number | {
            [key: string]: any;
        }>;
    };
    lg: {
        type: PropType<number | {
            [key: string]: any;
        }>;
    };
    xl: {
        type: PropType<number | {
            [key: string]: any;
        }>;
    };
    xxl: {
        type: PropType<number | {
            [key: string]: any;
        }>;
    };
    flex: {
        type: PropType<string | number>;
    };
}>, {
    visible: import("vue").ComputedRef<boolean>;
    classNames: import("vue").ComputedRef<string | {
        [x: string]: number | boolean | undefined;
    }>;
    styles: import("vue").ComputedRef<{
        flex?: FlexType | undefined;
        paddingLeft?: string | undefined;
        paddingRight?: string | undefined;
        paddingTop?: string | undefined;
        paddingBottom?: string | undefined;
    }>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    span: {
        type: NumberConstructor;
        default: number;
    };
    offset: {
        type: NumberConstructor;
    };
    order: {
        type: NumberConstructor;
    };
    xs: {
        type: PropType<number | {
            [key: string]: any;
        }>;
    };
    sm: {
        type: PropType<number | {
            [key: string]: any;
        }>;
    };
    md: {
        type: PropType<number | {
            [key: string]: any;
        }>;
    };
    lg: {
        type: PropType<number | {
            [key: string]: any;
        }>;
    };
    xl: {
        type: PropType<number | {
            [key: string]: any;
        }>;
    };
    xxl: {
        type: PropType<number | {
            [key: string]: any;
        }>;
    };
    flex: {
        type: PropType<string | number>;
    };
}>> & Readonly<{}>, {
    span: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
