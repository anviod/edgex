import { InnerValidateOptions } from './../interface';
import Base from './base';
declare class TypeValidator extends Base {
    constructor(obj: any, options: InnerValidateOptions);
    get email(): this;
    get url(): this;
    get ip(): this;
}
export default TypeValidator;
