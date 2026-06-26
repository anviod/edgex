import { ref, reactive, inject, computed } from "vue";
import { isString } from "../_utils/is.js";
import { configProviderInjectionKey } from "../config-provider/context.js";
import lang from "./lang/zh-cn.js";
const LOCALE = ref("zh-CN");
const I18N_MESSAGES = reactive({
  "zh-CN": lang
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
  const configProvider = inject(configProviderInjectionKey, void 0);
  const i18nMessage = computed(
    () => {
      var _a;
      return (_a = configProvider == null ? void 0 : configProvider.locale) != null ? _a : I18N_MESSAGES[LOCALE.value];
    }
  );
  const locale = computed(() => i18nMessage.value.locale);
  const transform = (key, ...args) => {
    const keyArray = key.split(".");
    let temp = i18nMessage.value;
    for (const keyItem of keyArray) {
      if (!temp[keyItem]) {
        return key;
      }
      temp = temp[keyItem];
    }
    if (isString(temp)) {
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
export { addI18nMessages, getLocale, useI18n, useLocale };
