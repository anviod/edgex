import { InnerValidateOptions } from './../interface';
import Base from './base';
declare class ArrayValidator extends Base {
    constructor(obj: any, options: InnerValidateOptions);
    length(num: number): this;
    minLength(num: number): this;
    maxLength(num: number): this;
    includes(arrays: number[]): this;
    deepEqual(other: number[]): this;
    get empty(): this;
}
export default ArrayValidator;
