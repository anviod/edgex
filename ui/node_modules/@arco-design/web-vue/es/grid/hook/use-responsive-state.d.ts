import { Ref } from 'vue';
import { ResponsiveValue } from '../interface';
export declare function useResponsiveState(val: Ref<number | ResponsiveValue>, defaultVal: number, fallbackToXs?: boolean): import("vue").ComputedRef<number>;
