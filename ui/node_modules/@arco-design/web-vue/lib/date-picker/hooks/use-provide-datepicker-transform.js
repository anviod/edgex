"use strict";
var vue = require("vue");
var date = require("../../_utils/date.js");
var index = require("../../locale/index.js");
var getValueByPath = require("../../_utils/get-value-by-path.js");
var context = require("../context.js");
function useDatePickerTransform(props) {
  const { locale } = vue.toRefs(props);
  const { locale: i18nLocale, t } = index.useI18n();
  date.dayjs.locale(i18nLocale.value.toLowerCase());
  const datePickerT = (key, ...args) => {
    const keyForLocale = key.startsWith("datePicker.") ? key.split(".").slice(1).join(".") : key;
    return getValueByPath.getValueByPath((locale == null ? void 0 : locale.value) || {}, keyForLocale) || t(key, ...args);
  };
  vue.provide(context.PickerInjectionKey, {
    datePickerT
  });
  return datePickerT;
}
module.exports = useDatePickerTransform;
