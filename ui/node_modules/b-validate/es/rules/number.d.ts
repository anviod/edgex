import { InnerValidateOptions } from './../interface';
import Base from './base';
declare class NumberValidator extends Base {
    constructor(obj: any, options: InnerValidateOptions);
    min(num: number): this;
    max(num: number): this;
    equal(num: number): this;
    range(min: number, max: number): this;
    get positive(): NumberValidator;
    get negative(): NumberValidator;
}
export default NumberValidator;
