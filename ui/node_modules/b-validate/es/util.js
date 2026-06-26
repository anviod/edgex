import { isObject } from './is.js';

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

export { getTemplate, mergeTemplate };
