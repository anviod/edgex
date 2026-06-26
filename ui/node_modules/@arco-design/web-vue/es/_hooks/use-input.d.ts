import { Ref } from 'vue';
import { EmitFn } from '../_utils/types';
import { FormItemEventHandler } from '../form/interface';
export declare const useInput: ({ defaultValue, modelValue, emit, eventName, updateEventName, eventHandlers, }: {
    defaultValue?: Ref<string, string> | undefined;
    modelValue?: Ref<string, string> | undefined;
    emit: EmitFn<any>;
    eventName?: string | undefined;
    updateEventName?: string | undefined;
    eventHandlers?: Ref<FormItemEventHandler, FormItemEventHandler> | undefined;
}) => {
    inputRef: Ref<HTMLInputElement | undefined, HTMLInputElement | undefined>;
    _value: Ref<string, string>;
    _focused: Ref<boolean, boolean>;
    isComposition: Ref<boolean, boolean>;
    compositionValue: Ref<string, string>;
    computedValue: import("vue").ComputedRef<string>;
    handleInput: (ev: Event) => void;
    handleComposition: (ev: CompositionEvent) => void;
    handleFocus: (ev: FocusEvent) => void;
    handleBlur: (ev: FocusEvent) => void;
    handleKeyDown: (ev: KeyboardEvent) => void;
    handleMousedown: (ev: MouseEvent) => void;
};
