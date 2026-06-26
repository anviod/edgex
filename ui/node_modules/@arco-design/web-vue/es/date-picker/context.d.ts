import { InjectionKey } from 'vue';
export declare const PickerInjectionKey: InjectionKey<string>;
export declare type PickerContext = Readonly<{
    datePickerT: (key: string, ...args: any[]) => any;
}>;
