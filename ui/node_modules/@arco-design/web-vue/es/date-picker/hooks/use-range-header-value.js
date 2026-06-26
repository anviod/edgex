import { toRefs, computed, reactive, nextTick } from "vue";
import pick from "../../_utils/pick.js";
import { methods, getSortedDayjsArray } from "../../_utils/date.js";
import usePanelSpan from "./use-panel-span.js";
import useHeaderValue from "./use-header-value.js";
function useRangeHeaderValue(props) {
  const {
    startHeaderMode,
    endHeaderMode,
    mode,
    value,
    defaultValue,
    selectedValue,
    format,
    onChange
  } = toRefs(props);
  const isDateOrWeek = computed(() => ["date", "week"].includes(mode.value));
  const unit = computed(() => isDateOrWeek.value ? "M" : "y");
  const isSame = (current, target) => current.isSame(target, unit.value);
  const { span, superSpan } = usePanelSpan(
    reactive({
      mode
    })
  );
  const startMode = computed(() => (startHeaderMode == null ? void 0 : startHeaderMode.value) || mode.value);
  const endMode = computed(() => (endHeaderMode == null ? void 0 : endHeaderMode.value) || mode.value);
  const startValue = computed(() => {
    var _a;
    return (_a = value.value) == null ? void 0 : _a[0];
  });
  const endValue = computed(() => {
    var _a;
    return (_a = value.value) == null ? void 0 : _a[1];
  });
  const startDefaultValue = computed(() => {
    var _a;
    return (_a = defaultValue.value) == null ? void 0 : _a[0];
  });
  const endDefaultValue = computed(() => {
    var _a;
    return (_a = defaultValue.value) == null ? void 0 : _a[1];
  });
  const emitChange = (newVal) => {
    (onChange == null ? void 0 : onChange.value) && onChange.value(newVal);
  };
  const {
    headerValue: startHeaderValue,
    setHeaderValue: setStartHeaderValue,
    headerOperations: startHeaderOperations,
    getDefaultLocalValue: getDefaultStartHeaderValue
  } = useHeaderValue(
    reactive({
      mode: startMode,
      value: startValue,
      defaultValue: startDefaultValue,
      selectedValue: void 0,
      format,
      onChange: (newVal) => {
        emitChange([newVal, endHeaderValue.value]);
      }
    })
  );
  const {
    headerValue: endHeaderValue,
    setHeaderValue: setEndHeaderValue,
    headerOperations: endHeaderOperations,
    getDefaultLocalValue: getDefaultEndHeaderValue
  } = useHeaderValue(
    reactive({
      mode: endMode,
      value: endValue,
      defaultValue: endDefaultValue,
      selectedValue: void 0,
      format,
      onChange: (newVal) => {
        emitChange([startHeaderValue.value, newVal]);
      }
    })
  );
  const setHeaderValue = (newVal) => {
    const isSameStartValue = isSame(startHeaderValue.value, newVal[0]);
    const isSameEndValue = isSame(endHeaderValue.value, newVal[1]);
    setStartHeaderValue(newVal[0], false);
    setEndHeaderValue(newVal[1], false);
    if (!isSameStartValue || !isSameEndValue) {
      (onChange == null ? void 0 : onChange.value) && (onChange == null ? void 0 : onChange.value(newVal));
    }
  };
  function getFixedValue(values) {
    let [header02, header12] = getSortedDayjsArray(values);
    const nextHeader = methods.add(header02, span.value, "M");
    if (header12.isBefore(nextHeader, unit.value)) {
      header12 = nextHeader;
    }
    return [header02, header12];
  }
  function getFormSelectedValue() {
    var _a, _b;
    let selected02 = (_a = selectedValue.value) == null ? void 0 : _a[0];
    let selected12 = (_b = selectedValue.value) == null ? void 0 : _b[1];
    if (selected02 && selected12) {
      [selected02, selected12] = getSortedDayjsArray([selected02, selected12]);
    }
    return [selected02, selected12];
  }
  const [selected0, selected1] = getFormSelectedValue();
  const [header0, header1] = getFixedValue([
    selected0 || startHeaderValue.value,
    selected1 || endHeaderValue.value
  ]);
  setStartHeaderValue(header0, false);
  setEndHeaderValue(header1, false);
  const resetHeaderValue = () => {
    const defaultStartHeaderValue = getDefaultStartHeaderValue();
    const defaultEndHeaderValue = getDefaultEndHeaderValue();
    nextTick(() => {
      const [selected02, selected12] = getFormSelectedValue();
      const [header02, header12] = getFixedValue([
        selected02 || defaultStartHeaderValue,
        selected12 || defaultEndHeaderValue
      ]);
      setHeaderValue([header02, header12]);
    });
  };
  const canShortenMonth = computed(
    () => methods.add(startHeaderValue.value, span.value, "M").isBefore(endHeaderValue.value, unit.value)
  );
  const canShortenYear = computed(
    () => methods.add(startHeaderValue.value, superSpan.value, "M").isBefore(endHeaderValue.value, unit.value)
  );
  const computedStartHeaderOperations = computed(() => {
    const operations = ["onSuperPrev"];
    if (isDateOrWeek.value)
      operations.push("onPrev");
    if (canShortenMonth.value && isDateOrWeek)
      operations.push("onNext");
    if (canShortenYear.value)
      operations.push("onSuperNext");
    return pick(startHeaderOperations.value, operations);
  });
  const computedEndHeaderOperations = computed(() => {
    const operations = ["onSuperNext"];
    if (isDateOrWeek.value)
      operations.push("onNext");
    if (canShortenMonth.value && isDateOrWeek.value)
      operations.push("onPrev");
    if (canShortenYear.value)
      operations.push("onSuperPrev");
    return pick(endHeaderOperations.value, operations);
  });
  return {
    startHeaderValue,
    endHeaderValue,
    startHeaderOperations: computedStartHeaderOperations,
    endHeaderOperations: computedEndHeaderOperations,
    setHeaderValue,
    resetHeaderValue
  };
}
export { useRangeHeaderValue as default };
