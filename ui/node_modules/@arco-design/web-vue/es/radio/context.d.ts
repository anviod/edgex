import type { InjectionKey, Slots } from 'vue';
import type { Size } from '../_utils/constant';
export declare const RADIO_TYPES: readonly ["radio", "button"];
export declare type RadioType = typeof RADIO_TYPES[number];
export interface RadioGroupContext {
    name: 'ArcoRadioGroup';
    value: string | number | boolean;
    size: Size;
    type: RadioType;
    disabled: boolean;
    slots: Slots;
    handleChange: (value: string | number | boolean, e: Event) => void;
}
export declare const radioGroupKey: InjectionKey<RadioGroupContext>;
