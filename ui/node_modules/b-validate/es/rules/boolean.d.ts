import { InnerValidateOptions } from './../interface';
import Base from './base';
declare class BooleanValidator extends Base {
    constructor(obj: any, options: InnerValidateOptions);
    get true(): this;
    get false(): this;
}
export default BooleanValidator;
