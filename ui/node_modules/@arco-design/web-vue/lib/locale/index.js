"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var is = require("../_utils/is.js");
var context = require("../config-provider/context.js");
var zhCn = require("./lang/zh-cn.js");
const LOCALE = vue.ref("zh-CN");
const I18N_MESSAGES = vue.reactive({
  "zh-CN": zhCn
});
const addI18nMessages = (messages, options) => {
  for (const key of Object.keys(messages)) {
    if (!I18N_MESSAGES[key] || (options == null ? void 0 : options.overwrite)) {
      I18N_MESSAGES[key] = messages[key];
    }
  }
};
const useLocale = (locale) => {
  if (!I18N_MESSAGES[locale]) {
    console.warn(`use ${locale} failed! Please add ${locale} first`);
    return;
  }
  LOCALE.value = locale;
};
const getLocale = () => {
  return LOCALE.value;
};
const useI18n = () => {
  const configProvider = vue.inject(context.configProviderInjectionKey, void 0);
  const i18nMessage = vue.computed(
    () => {
      var _a;
      return (_a = configProvider == null ? void 0 : configProvider.locale) != null ? _a : I18N_MESSAGES[LOCALE.value];
    }
  );
  const locale = vue.computed(() => i18nMessage.value.locale);
  const transform = (key, ...args) => {
    const keyArray = key.split(".");
    let temp = i18nMessage.value;
    for (const keyItem of keyArray) {
      if (!temp[keyItem]) {
        return key;
      }
      temp = temp[keyItem];
    }
    if (is.isString(temp)) {
      if (args.length > 0) {
        return temp.replace(/{(\d+)}/g, (sub, index) => {
          var _a;
          return (_a = args[index]) != null ? _a : sub;
        });
      }
      return temp;
    }
    return temp;
  };
  return {
    i18nMessage,
    locale,
    t: transform
  };
};
exports.addI18nMessages = addI18nMessages;
exports.getLocale = getLocale;
exports.useI18n = useI18n;
exports.useLocale = useLocale;
