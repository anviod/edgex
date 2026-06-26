import { InnerValidateOptions } from './../interface';
import Base from './base';
declare class ObjectValidator extends Base {
    constructor(obj: any, options: InnerValidateOptions);
    deepEqual(other: any): this;
    hasKeys(keys: string[]): this;
    get empty(): this;
}
export default ObjectValidator;
