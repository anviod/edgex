import { InnerValidateOptions } from './../interface';
import Base from './base';
declare class StringValidator extends Base {
    constructor(obj: any, options: InnerValidateOptions);
    maxLength(length: number): this;
    minLength(length: number): this;
    length(length: number): this;
    match(pattern: RegExp): this;
    get uppercase(): StringValidator;
    get lowercase(): StringValidator;
}
export default StringValidator;
