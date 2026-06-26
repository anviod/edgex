'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var opt = Object.prototype.toString;
function isArray(obj) {
    return opt.call(obj) === '[object Array]';
}
function isObject(obj) {
    return opt.call(obj) === '[object Object]';
}
function isString(obj) {
    return opt.call(obj) === '[object String]';
}
function isNumber(obj) {
    return opt.call(obj) === '[object Number]' && obj === obj; // eslint-disable-line
}
function isBoolean(obj) {
    return opt.call(obj) === '[object Boolean]';
}
function isFunction(obj) {
    return opt.call(obj) === '[object Function]';
}
function isEmptyObject(obj) {
    return isObject(obj) && Object.keys(obj).length === 0;
}
function isEmptyValue(obj) {
    return obj === undefined || obj === null || obj === '';
}
function isEmptyArray(obj) {
    return isArray(obj) && !obj.length;
}
var isEqual = function (obj, other) {
    if (typeof obj !== 'object' || typeof other !== 'object') {
        return obj === other;
    }
    if (isFunction(obj) && isFunction(other)) {
        return obj === other || obj.toString() === other.toString();
    }
    if (Object.keys(obj).length !== Object.keys(other).length) {
        return false;
    }
    for (var key in obj) {
        var result = isEqual(obj[key], other[key]);
        if (!result)
            { return false; }
    }
    return true;
};

var mergeTemplate = function (defaultValidateMessages, validateMessages) {
    var result = Object.assign({}, defaultValidateMessages);
    Object.keys(validateMessages || {}).forEach(function (key) {
        var defaultValue = result[key];
        var newValue = validateMessages === null || validateMessages === void 0 ? void 0 : validateMessages[key];
        result[key] = isObject(defaultValue)
            ? Object.assign(Object.assign({}, defaultValue), newValue) : newValue || defaultValue;
    });
    return result;
};
var getTemplate = function (validateMessages, keyPath) {
    var keys = keyPath.split('.');
    var result = validateMessages;
    for (var i = 0; i < keys.length; i++) {
        result = result && result[keys[i]];
        if (result === undefined) {
            return result;
        }
    }
    return result;
};

var defaultTypeTemplate = '#{field} is not a #{type} type';
var defaultValidateLocale = {
    required: '#{field} is required',
    type: {
        ip: defaultTypeTemplate,
        email: defaultTypeTemplate,
        url: defaultTypeTemplate,
        string: defaultTypeTemplate,
        number: defaultTypeTemplate,
        array: defaultTypeTemplate,
        object: defaultTypeTemplate,
        boolean: defaultTypeTemplate,
    },
    number: {
        min: '`#{value}` is not greater than `#{min}`',
        max: '`#{value}` is not less than `#{max}`',
        equal: '`#{value}` is not equal to `#{equal}`',
        range: '`#{value}` is not in range `#{min} ~ #{max}`',
        positive: '`#{value}` is not a positive number',
        negative: '`#{value}` is not a negative number',
    },
    string: {
        maxLength: '#{field} cannot be longer than #{maxLength} characters',
        minLength: '#{field} must be at least #{minLength} characters',
        length: '#{field} must be exactly #{length} characters',
        match: '`#{value}` does not match pattern #{pattern}',
        uppercase: '`#{value}` must be all uppercase',
        lowercase: '`#{value}` must be all lowercased',
    },
    array: {
        length: '#{field} must be exactly #{length} in length',
        minLength: '#{field} cannot be less than #{minLength} in length',
        maxLength: '#{field} cannot be greater than #{maxLength} in length',
        includes: '#{field} is not includes #{includes}',
        deepEqual: '#{field} is not deep equal with #{deepEqual}',
        empty: '#{field} is not an empty array',
    },
    object: {
        deepEqual: '#{field} is not deep equal to expected value',
        hasKeys: '#{field} does not contain required fields',
        empty: '#{field} is not an empty object',
    },
    boolean: {
        true: 'Expect true but got `#{value}`',
        false: 'Expect false but got `#{value}`',
    },
};

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

exports.DefaultValidateMessage = defaultValidateLocale;
exports.Schema = Schema;
exports.default = BValidate;
