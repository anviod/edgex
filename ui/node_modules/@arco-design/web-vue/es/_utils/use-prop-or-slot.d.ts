import { Slots } from 'vue';
export default function usePropOrSlot<T = {
    [key: string]: any;
}>(props: T, slots: Slots, propName: string): import("vue").ComputedRef<any>;
export declare function hasPropOrSlot<T = {
    [key: string]: any;
}>(props: T, slots: Slots, propName: string): import("vue").ComputedRef<boolean>;
