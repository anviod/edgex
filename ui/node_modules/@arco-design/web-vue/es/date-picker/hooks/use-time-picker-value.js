import { toRefs, computed, reactive, ref, watch } from "vue";
import useTimeFormat from "../../time-picker/hooks/use-time-format.js";
import { getDayjsValue, getNow } from "../../_utils/date.js";
function useTimePickerValue(props) {
  const { timePickerProps, selectedValue } = toRefs(props);
  const timePickerPropsFormat = computed(() => {
    var _a;
    return (_a = timePickerProps == null ? void 0 : timePickerProps.value) == null ? void 0 : _a.format;
  });
  const timePickerPropsUse12Hours = computed(
    () => {
      var _a;
      return !!((_a = timePickerProps == null ? void 0 : timePickerProps.value) == null ? void 0 : _a.use12Hours);
    }
  );
  const { format } = useTimeFormat(
    reactive({
      format: timePickerPropsFormat,
      use12Hours: timePickerPropsUse12Hours
    })
  );
  const defaultTimePickerValue = computed(
    () => {
      var _a;
      return getDayjsValue(
        (_a = timePickerProps == null ? void 0 : timePickerProps.value) == null ? void 0 : _a.defaultValue,
        format.value
      );
    }
  );
  const getDefaultValue = () => (selectedValue == null ? void 0 : selectedValue.value) || defaultTimePickerValue.value || getNow();
  const timePickerValue = ref(getDefaultValue());
  function setTimePickerValue(val) {
    if (val) {
      timePickerValue.value = val;
    }
  }
  function resetTimePickerValue() {
    timePickerValue.value = getDefaultValue();
  }
  watch(selectedValue, (newVal) => {
    setTimePickerValue(newVal);
  });
  return [timePickerValue, setTimePickerValue, resetTimePickerValue];
}
export { useTimePickerValue as default };
