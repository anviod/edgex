import { ValidatorError, ValidateOptions, InnerValidateOptions, ValidateMessagesTemplateType } from './../interface';
/**
 * @param options.trim trim string value
 * @param options.ignoreEmptyString used form type
 * @param options.message
 * @param options.type
 */
declare class Base {
    obj: any;
    message: ValidateOptions['message'];
    type: ValidateOptions['type'];
    error: null | ValidatorError;
    _not?: boolean;
    validateMessages: ValidateMessagesTemplateType;
    field?: string;
    constructor(obj: any, options: InnerValidateOptions);
    get not(): this;
    get isRequired(): this;
    get end(): ValidatorError;
    addError(message: any): void;
    getValidateMsg: (keyPath: string, info?: any) => any;
    validate(expression: boolean, errorMessage: any): this;
    collect(callback: (error: null | ValidatorError) => void): void;
}
export default Base;
