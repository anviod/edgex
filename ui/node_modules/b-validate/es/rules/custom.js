import Base from './base.js';

var CustomValidator = /*@__PURE__*/(function (Base) {
    function CustomValidator(obj, options) {
        Base.call(this, obj, Object.assign(Object.assign({}, options), { type: 'custom' }));
    }

    if ( Base ) CustomValidator.__proto__ = Base;
    CustomValidator.prototype = Object.create( Base && Base.prototype );
    CustomValidator.prototype.constructor = CustomValidator;

    var prototypeAccessors = { validate: { configurable: true } };
    // @ts-ignore
    prototypeAccessors.validate.get = function () {
        var _this = this;
        return function (validator, callback) {
            var ret;
            if (validator) {
                ret = validator(_this.obj, _this.addError.bind(_this));
                if (ret && ret.then) {
                    if (callback) {
                        ret.then(function () {
                            callback && callback(_this.error);
                        }, function (e) {
                            console.error(e);
                        });
                    }
                    return [ret, _this];
                }
                else {
                    callback && callback(_this.error);
                    return _this.error;
                }
            }
        };
    };

    Object.defineProperties( CustomValidator.prototype, prototypeAccessors );

    return CustomValidator;
}(Base));

export { CustomValidator as default };
