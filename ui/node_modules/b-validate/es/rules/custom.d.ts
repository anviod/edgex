import { InnerValidateOptions, ValidatorError, CustomValidatorType } from './../interface';
import Base from './base';
declare class CustomValidator extends Base {
    constructor(obj: any, options: InnerValidateOptions);
    get validate(): (validator: CustomValidatorType, callback?: (message?: ValidatorError | null) => void) => any[] | ValidatorError;
}
export default CustomValidator;
