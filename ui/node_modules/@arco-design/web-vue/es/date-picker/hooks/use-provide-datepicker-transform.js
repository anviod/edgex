import { toRefs, provide } from "vue";
import { dayjs } from "../../_utils/date.js";
import { useI18n } from "../../locale/index.js";
import { getValueByPath } from "../../_utils/get-value-by-path.js";
import { PickerInjectionKey } from "../context.js";
function useDatePickerTransform(props) {
  const { locale } = toRefs(props);
  const { locale: i18nLocale, t } = useI18n();
  dayjs.locale(i18nLocale.value.toLowerCase());
  const datePickerT = (key, ...args) => {
    const keyForLocale = key.startsWith("datePicker.") ? key.split(".").slice(1).join(".") : key;
    return getValueByPath((locale == null ? void 0 : locale.value) || {}, keyForLocale) || t(key, ...args);
  };
  provide(PickerInjectionKey, {
    datePickerT
  });
  return datePickerT;
}
export { useDatePickerTransform as default };
