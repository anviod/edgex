import Base from './base.js';
import { isString } from '../is.js';

var StringValidator = /*@__PURE__*/(function (Base) {
    function StringValidator(obj, options) {
        Base.call(this, obj, Object.assign(Object.assign({}, options), { type: 'string' }));
        this.validate(options && options.strict ? isString(this.obj) : true, this.getValidateMsg('type.string'));
    }

    if ( Base ) StringValidator.__proto__ = Base;
    StringValidator.prototype = Object.create( Base && Base.prototype );
    StringValidator.prototype.constructor = StringValidator;

    var prototypeAccessors = { uppercase: { configurable: true },lowercase: { configurable: true } };
    StringValidator.prototype.maxLength = function maxLength (length) {
        return this.obj
            ? this.validate(this.obj.length <= length, this.getValidateMsg('string.maxLength', { maxLength: length }))
            : this;
    };
    StringValidator.prototype.minLength = function minLength (length) {
        return this.obj
            ? this.validate(this.obj.length >= length, this.getValidateMsg('string.minLength', { minLength: length }))
            : this;
    };
    StringValidator.prototype.length = function length (length$1) {
        return this.obj
            ? this.validate(this.obj.length === length$1, this.getValidateMsg('string.length', { length: length$1 }))
            : this;
    };
    StringValidator.prototype.match = function match (pattern) {
        var isRegex = pattern instanceof RegExp;
        if (isRegex) {
            pattern.lastIndex = 0;
        }
        return this.validate(this.obj === undefined || (isRegex && pattern.test(this.obj)), this.getValidateMsg('string.match', { pattern: pattern }));
    };
    prototypeAccessors.uppercase.get = function () {
        return this.obj
            ? this.validate(this.obj.toUpperCase() === this.obj, this.getValidateMsg('string.uppercase'))
            : this;
    };
    prototypeAccessors.lowercase.get = function () {
        return this.obj
            ? this.validate(this.obj.toLowerCase() === this.obj, this.getValidateMsg('string.lowercase'))
            : this;
    };

    Object.defineProperties( StringValidator.prototype, prototypeAccessors );

    return StringValidator;
}(Base));

export { StringValidator as default };
