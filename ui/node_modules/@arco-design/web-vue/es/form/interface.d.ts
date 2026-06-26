export declare const VALIDATE_STATUSES: readonly ["success", "warning", "error", "validating"];
export declare type ValidateStatus = typeof VALIDATE_STATUSES[number];
export declare const VALIDATE_TRIGGERS: readonly ["change", "input", "focus", "blur"];
export declare type ValidateTrigger = typeof VALIDATE_TRIGGERS[number];
export interface FieldRule<FieldValue = any> {
    type?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email' | 'url' | 'ip';
    required?: boolean;
    message?: string;
    length?: number;
    maxLength?: number;
    minLength?: number;
    match?: RegExp;
    uppercase?: boolean;
    lowercase?: boolean;
    min?: number;
    max?: number;
    equal?: number;
    positive?: boolean;
    negative?: boolean;
    true?: boolean;
    false?: boolean;
    includes?: any[];
    deepEqual?: any;
    empty?: boolean;
    hasKeys?: string[];
    validator?: (value: FieldValue | undefined, callback: (error?: string) => void) => void;
}
export interface FieldData {
    value?: any;
    status?: ValidateStatus;
    message?: string;
}
export interface ValidatedError {
    label: string;
    field: string;
    value: any;
    type: string;
    isRequiredError: boolean;
    message: string;
}
export interface FormItemEventHandler {
    onChange?: (ev?: Event) => void;
    onInput?: (ev?: Event) => void;
    onFocus?: (ev?: Event) => void;
    onBlur?: (ev?: Event) => void;
}
