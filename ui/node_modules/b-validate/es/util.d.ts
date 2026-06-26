import { ValidateMessagesType, ValidateMessagesTemplateType } from './interface';
export declare const mergeTemplate: <T = Partial<{
    required: string;
    type: Record<"string" | "number" | "boolean" | "object" | "array" | "url" | "email" | "ip", string | ((info: any) => any)>;
    number: Record<"min" | "max" | "equal" | "range" | "positive" | "negative", string | ((info: any) => any)>;
    string: Record<"maxLength" | "minLength" | "length" | "match" | "uppercase" | "lowercase", string | ((info: any) => any)>;
    array: Record<"maxLength" | "minLength" | "length" | "includes" | "deepEqual" | "empty", string | ((info: any) => any)>;
    object: Record<"deepEqual" | "empty" | "hasKeys", string | ((info: any) => any)>;
    boolean: Record<"true" | "false", string | ((info: any) => any)>;
}>>(defaultValidateMessages: T, validateMessages: ValidateMessagesType) => T;
export declare const getTemplate: (validateMessages: ValidateMessagesTemplateType, keyPath: string) => {
    required: string;
    type: {
        ip: string;
        email: string;
        url: string;
        string: string;
        number: string;
        array: string;
        object: string;
        boolean: string;
    };
    number: {
        min: string;
        max: string;
        equal: string;
        range: string;
        positive: string;
        negative: string;
    };
    string: {
        maxLength: string;
        minLength: string;
        length: string;
        match: string;
        uppercase: string;
        lowercase: string;
    };
    array: {
        length: string;
        minLength: string;
        maxLength: string;
        includes: string;
        deepEqual: string;
        empty: string;
    };
    object: {
        deepEqual: string;
        hasKeys: string;
        empty: string;
    };
    boolean: {
        true: string;
        false: string;
    };
};
