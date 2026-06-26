import { Ref } from 'vue';
import { ResponsiveValue } from '../interface';
export declare function useResponsiveValue(props: Ref<{
    val: number;
    key: string;
    xs?: number | {
        [key: string]: any;
    };
    sm?: number | {
        [key: string]: any;
    };
    md?: number | {
        [key: string]: any;
    };
    lg?: number | {
        [key: string]: any;
    };
    xl?: number | {
        [key: string]: any;
    };
    xxl?: number | {
        [key: string]: any;
    };
}>): import("vue").ComputedRef<number | ResponsiveValue>;
