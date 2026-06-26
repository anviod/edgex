import Base from './base.js';
import { isEqual, isArray, isEmptyArray } from '../is.js';

var ArrayValidator = /*@__PURE__*/(function (Base) {
    function ArrayValidator(obj, options) {
        Base.call(this, obj, Object.assign(Object.assign({}, options), { type: 'array' }));
        this.validate(options && options.strict ? isArray(this.obj) : true, this.getValidateMsg('type.array', { value: this.obj, type: this.type }));
    }

    if ( Base ) ArrayValidator.__proto__ = Base;
    ArrayValidator.prototype = Object.create( Base && Base.prototype );
    ArrayValidator.prototype.constructor = ArrayValidator;

    var prototypeAccessors = { empty: { configurable: true } };
    ArrayValidator.prototype.length = function length (num) {
        return this.obj
            ? this.validate(this.obj.length === num, this.getValidateMsg('array.length', { value: this.obj, length: num }))
            : this;
    };
    ArrayValidator.prototype.minLength = function minLength (num) {
        return this.obj
            ? this.validate(this.obj.length >= num, this.getValidateMsg('array.minLength', { value: this.obj, minLength: num }))
            : this;
    };
    ArrayValidator.prototype.maxLength = function maxLength (num) {
        return this.obj
            ? this.validate(this.obj.length <= num, this.getValidateMsg('array.maxLength', { value: this.obj, maxLength: num }))
            : this;
    };
    ArrayValidator.prototype.includes = function includes (arrays) {
        var this$1$1 = this;

        return this.obj
            ? this.validate(arrays.every(function (el) { return this$1$1.obj.indexOf(el) !== -1; }), this.getValidateMsg('array.includes', {
                value: this.obj,
                includes: arrays,
            }))
            : this;
    };
    ArrayValidator.prototype.deepEqual = function deepEqual (other) {
        return this.obj
            ? this.validate(isEqual(this.obj, other), this.getValidateMsg('array.deepEqual', { value: this.obj, deepEqual: other }))
            : this;
    };
    prototypeAccessors.empty.get = function () {
        return this.validate(isEmptyArray(this.obj), this.getValidateMsg('array.empty', { value: this.obj }));
    };

    Object.defineProperties( ArrayValidator.prototype, prototypeAccessors );

    return ArrayValidator;
}(Base));

export { ArrayValidator as default };
