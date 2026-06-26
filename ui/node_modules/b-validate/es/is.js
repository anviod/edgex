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

export { isArray, isBoolean, isEmptyArray, isEmptyObject, isEmptyValue, isEqual, isFunction, isNumber, isObject, isString };
