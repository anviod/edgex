import ValidateMessages from './message';
export type ValidateMessagesTemplateType = typeof ValidateMessages;
export type ValidateMessagesType = Partial<{
    [key in keyof ValidateMessagesTemplateType]: ValidateMessagesTemplateType[key] extends string ? ValidateMessagesTemplateType[key] : Record<keyof ValidateMessagesTemplateType[key], string | ((info: any) => any)>;
}>;
export type RuleType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'url' | 'email' | 'ip' | 'type' | 'custom';
export type GlobalConfig = Pick<ValidateOptions, 'strict' | 'trim' | 'ignoreEmptyString' | 'validateMessages'>;
export type ValidateOptions = {
    strict?: boolean;
    trim?: boolean;
    ignoreEmptyString?: boolean;
    message?: any;
    type?: RuleType;
    validateMessages?: ValidateMessagesType;
};
export type InnerValidateOptions = ValidateOptions & {
    field?: string;
};
export type CustomValidatorType = (value: any, callback: (message?: any) => void) => Promise<void> | void;
export type SchemaRuleType = {
    required?: boolean;
    message?: any;
    validator?: CustomValidatorType;
    type?: RuleType;
    true?: boolean;
    false?: boolean;
    deepEqual?: any;
    hasKeys?: string[];
    empty?: boolean;
    includes?: any;
    maxLength?: number;
    minLength?: number;
    pattern?: RegExp;
    length?: number;
    uppercase?: boolean;
    lowercase?: boolean;
    min?: number;
    max?: number;
    equal?: number;
    positive?: boolean;
    negative?: boolean;
    ignoreEmptyString?: boolean;
    strict?: boolean;
};
export type SchemaType = {
    [key: string]: SchemaRuleType[];
};
export type ValidatorError = {
    value: any;
    type: ValidateOptions['type'];
    requiredError?: boolean;
    message?: any;
};
