import Base from './base.js';
import { isBoolean } from '../is.js';

var BooleanValidator = /*@__PURE__*/(function (Base) {
    function BooleanValidator(obj, options) {
        Base.call(this, obj, Object.assign(Object.assign({}, options), { type: 'boolean' }));
        this.validate(options && options.strict ? isBoolean(this.obj) : true, this.getValidateMsg('type.boolean'));
    }

    if ( Base ) BooleanValidator.__proto__ = Base;
    BooleanValidator.prototype = Object.create( Base && Base.prototype );
    BooleanValidator.prototype.constructor = BooleanValidator;

    var prototypeAccessors = { true: { configurable: true },false: { configurable: true } };
    prototypeAccessors.true.get = function () {
        return this.validate(this.obj === true, this.getValidateMsg('boolean.true'));
    };
    prototypeAccessors.false.get = function () {
        return this.validate(this.obj === false, this.getValidateMsg('boolean.false'));
    };

    Object.defineProperties( BooleanValidator.prototype, prototypeAccessors );

    return BooleanValidator;
}(Base));

export { BooleanValidator as default };
