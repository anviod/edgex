"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var context = require("../config-provider/context.js");
const COMPONENT_PREFIX = "A";
const CLASS_PREFIX = "arco";
const GLOBAL_CONFIG_NAME = "$arco";
const getComponentPrefix = (options) => {
  var _a;
  return (_a = options == null ? void 0 : options.componentPrefix) != null ? _a : COMPONENT_PREFIX;
};
const setGlobalConfig = (app, options) => {
  var _a;
  if (options && options.classPrefix) {
    app.config.globalProperties[GLOBAL_CONFIG_NAME] = {
      ...(_a = app.config.globalProperties[GLOBAL_CONFIG_NAME]) != null ? _a : {},
      classPrefix: options.classPrefix
    };
  }
};
const getPrefixCls = (componentName) => {
  var _a, _b, _c;
  const instance = vue.getCurrentInstance();
  const configProvider = vue.inject(context.configProviderInjectionKey, void 0);
  const prefix = (_c = (_b = configProvider == null ? void 0 : configProvider.prefixCls) != null ? _b : (_a = instance == null ? void 0 : instance.appContext.config.globalProperties[GLOBAL_CONFIG_NAME]) == null ? void 0 : _a.classPrefix) != null ? _c : CLASS_PREFIX;
  if (componentName) {
    return `${prefix}-${componentName}`;
  }
  return prefix;
};
exports.getComponentPrefix = getComponentPrefix;
exports.getPrefixCls = getPrefixCls;
exports.setGlobalConfig = setGlobalConfig;
