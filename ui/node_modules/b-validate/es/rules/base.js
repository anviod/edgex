import { isObject, isFunction, isString, isArray, isEmptyValue, isEmptyArray } from '../is.js';
import { getTemplate, mergeTemplate } from '../util.js';
import defaultValidateLocale from '../locale/en-US.js';

/**
 * @param options.trim trim string value
 * @param options.ignoreEmptyString used form type
 * @param options.message
 * @param options.type
 */
var Base = function Base(obj, options) {
    var this$1$1 = this;

    this.getValidateMsg = function (keyPath, info) {
        if ( info === void 0 ) info = {};

        var data = Object.assign(Object.assign({}, info), { value: this$1$1.obj, field: this$1$1.field, type: this$1$1.type });
        var template = getTemplate(this$1$1.validateMessages, keyPath);
        if (isFunction(template)) {
            return template(data);
        }
        if (isString(template)) {
            return template.replace(/\#\{.+?\}/g, function (variable) {
                var key = variable.slice(2, -1);
                if (key in data) {
                    if (isObject(data[key]) || isArray(data[key])) {
                        try {
                            return JSON.stringify(data[key]);
                        }
                        catch (_) {
                            return data[key];
                        }
                    }
                    return String(data[key]);
                }
                return variable;
            });
        }
        return template;
    };
    if (isObject(options) && isString(obj) && options.trim) {
        this.obj = obj.trim();
    }
    else if (isObject(options) && options.ignoreEmptyString && obj === '') {
        this.obj = undefined;
    }
    else {
        this.obj = obj;
    }
    this.message = options.message;
    this.type = options.type;
    this.error = null;
    this.field = options.field || options.type;
    this.validateMessages = mergeTemplate(defaultValidateLocale, options.validateMessages);
};

var prototypeAccessors = { not: { configurable: true },isRequired: { configurable: true },end: { configurable: true } };
prototypeAccessors.not.get = function () {
    this._not = !this._not;
    return this;
};
prototypeAccessors.isRequired.get = function () {
    if (isEmptyValue(this.obj) || isEmptyArray(this.obj)) {
        var message = this.getValidateMsg('required');
        this.error = {
            value: this.obj,
            type: this.type,
            requiredError: true,
            message: this.message ||
                (isObject(message) ? message : ("" + (this._not ? '[NOT MODE]:' : '') + message)),
        };
    }
    return this;
};
prototypeAccessors.end.get = function () {
    return this.error;
};
Base.prototype.addError = function addError (message) {
    if (!this.error && message) {
        this.error = {
            value: this.obj,
            type: this.type,
            message: this.message ||
                (isObject(message) ? message : ("" + (this._not ? '[NOT MODE]:' : '') + message)),
        };
    }
};
Base.prototype.validate = function validate (expression, errorMessage) {
    var _expression = this._not ? expression : !expression;
    if (_expression) {
        this.addError(errorMessage);
    }
    return this;
};
Base.prototype.collect = function collect (callback) {
    callback && callback(this.error);
};

Object.defineProperties( Base.prototype, prototypeAccessors );

export { Base as default };
