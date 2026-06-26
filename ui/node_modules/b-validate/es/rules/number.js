import Base from './base.js';
import { isEmptyValue, isNumber } from '../is.js';

var NumberValidator = /*@__PURE__*/(function (Base) {
    function NumberValidator(obj, options) {
        Base.call(this, obj, Object.assign(Object.assign({}, options), { type: 'number' }));
        this.validate(options && options.strict ? isNumber(this.obj) : true, this.getValidateMsg('type.number'));
    }

    if ( Base ) NumberValidator.__proto__ = Base;
    NumberValidator.prototype = Object.create( Base && Base.prototype );
    NumberValidator.prototype.constructor = NumberValidator;

    var prototypeAccessors = { positive: { configurable: true },negative: { configurable: true } };
    NumberValidator.prototype.min = function min (num) {
        return !isEmptyValue(this.obj)
            ? this.validate(this.obj >= num, this.getValidateMsg('number.min', { min: num }))
            : this;
    };
    NumberValidator.prototype.max = function max (num) {
        return !isEmptyValue(this.obj)
            ? this.validate(this.obj <= num, this.getValidateMsg('number.max', { max: num }))
            : this;
    };
    NumberValidator.prototype.equal = function equal (num) {
        return !isEmptyValue(this.obj)
            ? this.validate(this.obj === num, this.getValidateMsg('number.equal', { equal: num }))
            : this;
    };
    NumberValidator.prototype.range = function range (min, max) {
        return !isEmptyValue(this.obj)
            ? this.validate(this.obj >= min && this.obj <= max, this.getValidateMsg('number.range', { min: min, max: max }))
            : this;
    };
    prototypeAccessors.positive.get = function () {
        return !isEmptyValue(this.obj)
            ? this.validate(this.obj > 0, this.getValidateMsg('number.positive'))
            : this;
    };
    prototypeAccessors.negative.get = function () {
        return !isEmptyValue(this.obj)
            ? this.validate(this.obj < 0, this.getValidateMsg('number.negative'))
            : this;
    };

    Object.defineProperties( NumberValidator.prototype, prototypeAccessors );

    return NumberValidator;
}(Base));

export { NumberValidator as default };
