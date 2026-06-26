import Base from './base.js';

var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var regexUrl = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
var regexIp = /^(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})(\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})){3}$/;
var TypeValidator = /*@__PURE__*/(function (Base) {
    function TypeValidator(obj, options) {
        Base.call(this, obj, Object.assign(Object.assign({}, options), { type: 'type' }));
    }

    if ( Base ) TypeValidator.__proto__ = Base;
    TypeValidator.prototype = Object.create( Base && Base.prototype );
    TypeValidator.prototype.constructor = TypeValidator;

    var prototypeAccessors = { email: { configurable: true },url: { configurable: true },ip: { configurable: true } };
    prototypeAccessors.email.get = function () {
        this.type = 'email';
        return this.validate(this.obj === undefined || regexEmail.test(this.obj), this.getValidateMsg('type.email'));
    };
    prototypeAccessors.url.get = function () {
        this.type = 'url';
        return this.validate(this.obj === undefined || regexUrl.test(this.obj), this.getValidateMsg('type.url'));
    };
    prototypeAccessors.ip.get = function () {
        this.type = 'ip';
        return this.validate(this.obj === undefined || regexIp.test(this.obj), this.getValidateMsg('type.ip'));
    };

    Object.defineProperties( TypeValidator.prototype, prototypeAccessors );

    return TypeValidator;
}(Base));

export { TypeValidator as default };
