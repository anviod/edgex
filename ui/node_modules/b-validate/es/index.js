import { isObject, isArray } from './is.js';
import StringValidator from './rules/string.js';
import NumberValidator from './rules/number.js';
import ArrayValidator from './rules/array.js';
import ObjectValidator from './rules/object.js';
import BooleanValidator from './rules/boolean.js';
import TypeValidator from './rules/type.js';
import CustomValidator from './rules/custom.js';
import { mergeTemplate } from './util.js';
export { default as DefaultValidateMessage } from './locale/en-US.js';

var BValidate = function (obj, options) {
    return new Validate(obj, Object.assign({ field: 'value' }, options));
};
BValidate.globalConfig = {};
// 全局生效校验信息
BValidate.setGlobalConfig = function (options) {
    BValidate.globalConfig = options || {};
};
var Validate = function Validate(obj, _options) {
    var globalConfig = BValidate.globalConfig;
    var options = Object.assign(Object.assign(Object.assign({}, globalConfig), _options), { validateMessages: mergeTemplate(globalConfig.validateMessages, _options.validateMessages) });
    this.string = new StringValidator(obj, options);
    this.number = new NumberValidator(obj, options);
    this.array = new ArrayValidator(obj, options);
    this.object = new ObjectValidator(obj, options);
    this.boolean = new BooleanValidator(obj, options);
    this.type = new TypeValidator(obj, options);
    this.custom = new CustomValidator(obj, options);
};
var Schema = function Schema(schema, options) {
    if ( options === void 0 ) options = {};

    this.schema = schema;
    this.options = options;
};
// 更新校验信息
Schema.prototype.messages = function messages (validateMessages) {
    this.options = Object.assign(Object.assign({}, this.options), { validateMessages: mergeTemplate(this.options.validateMessages, validateMessages) });
};
Schema.prototype.validate = function validate (values, callback) {
        var this$1$1 = this;

    if (!isObject(values)) {
        return;
    }
    var promises = [];
    var errors = null;
    function setError(key, error) {
        if (!errors) {
            errors = {};
        }
        if (!errors[key] || error.requiredError) {
            errors[key] = error;
        }
    }
    if (this.schema) {
        Object.keys(this.schema).forEach(function (key) {
            if (isArray(this$1$1.schema[key])) {
                var loop = function ( i ) {
                    var rule = this$1$1.schema[key][i];
                    var type = rule.type;
                    var message = rule.message;
                    if (!type && !rule.validator) {
                        throw ("You must specify a type to field " + key + "!");
                    }
                    var _options = Object.assign(Object.assign({}, this$1$1.options), { message: message, field: key });
                    if ('ignoreEmptyString' in rule) {
                        _options.ignoreEmptyString = rule.ignoreEmptyString;
                    }
                    if ('strict' in rule) {
                        _options.strict = rule.strict;
                    }
                    var validator = new Validate(values[key], _options);
                    var bv = validator.type[type] || null;
                    if (!bv) {
                        if (rule.validator) {
                            bv = validator.custom.validate(rule.validator);
                            if (Object.prototype.toString.call(bv) === '[object Array]' && bv[0].then) {
                                promises.push({
                                    function: bv[0],
                                    _this: bv[1],
                                    key: key,
                                });
                            }
                            else if (bv) {
                                setError(key, bv);
                            }
                            return;
                        }
                        else {
                            bv = validator[type];
                        }
                    }
                    Object.keys(rule).forEach(function (r) {
                        if (rule.required) {
                            bv = bv.isRequired;
                        }
                        if (r !== 'message' && bv[r] && rule[r] && typeof bv[r] === 'object') {
                            bv = bv[r];
                        }
                        if (bv[r] && rule[r] !== undefined && typeof bv[r] === 'function') {
                            bv = bv[r](rule[r]);
                        }
                    });
                    bv.collect(function (error) {
                        if (error) {
                            setError(key, error);
                        }
                    });
                    if (errors) {
                        return 'break';
                    }
                };

                    for (var i = 0; i < this$1$1.schema[key].length; i++) {
                        var returned = loop( i );

                        if ( returned === 'break' ) break;
                    }
            }
        });
    }
    if (promises.length > 0) {
        Promise.all(promises.map(function (a) { return a.function; })).then(function () {
            promises.forEach(function (promise) {
                if (promise._this.error) {
                    setError(promise.key, promise._this.error);
                }
            });
            callback && callback(errors);
        });
    }
    else {
        callback && callback(errors);
    }
};

export { Schema, BValidate as default };
