import { SchemaType, ValidateOptions, InnerValidateOptions, ValidateMessagesType, GlobalConfig } from './interface';
import StringValidator from './rules/string';
import NumberValidator from './rules/number';
import ArrayValidator from './rules/array';
import ObjectValidator from './rules/object';
import BooleanValidator from './rules/boolean';
import TypeValidator from './rules/type';
import CustomValidator from './rules/custom';
declare const BValidate: {
    (obj: any, options: ValidateOptions): Validate;
    globalConfig: GlobalConfig;
    setGlobalConfig(options: GlobalConfig): void;
};
declare class Validate {
    number: NumberValidator;
    string: StringValidator;
    array: ArrayValidator;
    object: ObjectValidator;
    boolean: BooleanValidator;
    type: TypeValidator;
    custom: CustomValidator;
    constructor(obj: any, _options: InnerValidateOptions);
}
export declare class Schema {
    schema: SchemaType;
    options: ValidateOptions;
    constructor(schema: SchemaType, options?: ValidateOptions);
    messages(validateMessages: ValidateMessagesType): void;
    validate(values: {
        [key: string]: any;
    }, callback: any): void;
}
export { SchemaType, SchemaRuleType, ValidateOptions, ValidateMessagesType, ValidateMessagesTemplateType, } from './interface';
export { default as DefaultValidateMessage } from './message';
export default BValidate;
