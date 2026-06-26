import Base from './base.js';
import { isEqual, isObject, isEmptyObject } from '../is.js';

var ObjectValidator = /*@__PURE__*/(function (Base) {
    function ObjectValidator(obj, options) {
        Base.call(this, obj, Object.assign(Object.assign({}, options), { type: 'object' }));
        this.validate(options && options.strict ? isObject(this.obj) : true, this.getValidateMsg('type.object'));
    }

    if ( Base ) ObjectValidator.__proto__ = Base;
    ObjectValidator.prototype = Object.create( Base && Base.prototype );
    ObjectValidator.prototype.constructor = ObjectValidator;

    var prototypeAccessors = { empty: { configurable: true } };
    ObjectValidator.prototype.deepEqual = function deepEqual (other) {
        return this.obj
            ? this.validate(isEqual(this.obj, other), this.getValidateMsg('object.deepEqual', { deepEqual: other }))
            : this;
    };
    ObjectValidator.prototype.hasKeys = function hasKeys (keys) {
        var this$1$1 = this;

        return this.obj
            ? this.validate(keys.every(function (el) { return this$1$1.obj[el]; }), this.getValidateMsg('object.hasKeys', { keys: keys }))
            : this;
    };
    prototypeAccessors.empty.get = function () {
        return this.validate(isEmptyObject(this.obj), this.getValidateMsg('object.empty'));
    };

    Object.defineProperties( ObjectValidator.prototype, prototypeAccessors );

    return ObjectValidator;
}(Base));

export { ObjectValidator as default };
