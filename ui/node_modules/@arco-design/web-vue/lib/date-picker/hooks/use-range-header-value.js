"use strict";
var vue = require("vue");
var pick = require("../../_utils/pick.js");
var date = require("../../_utils/date.js");
var usePanelSpan = require("./use-panel-span.js");
var useHeaderValue = require("./use-header-value.js");
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
  } = vue.toRefs(props);
  const isDateOrWeek = vue.computed(() => ["date", "week"].includes(mode.value));
  const unit = vue.computed(() => isDateOrWeek.value ? "M" : "y");
  const isSame = (current, target) => current.isSame(target, unit.value);
  const { span, superSpan } = usePanelSpan(
    vue.reactive({
      mode
    })
  );
  const startMode = vue.computed(() => (startHeaderMode == null ? void 0 : startHeaderMode.value) || mode.value);
  const endMode = vue.computed(() => (endHeaderMode == null ? void 0 : endHeaderMode.value) || mode.value);
  const startValue = vue.computed(() => {
    var _a;
    return (_a = value.value) == null ? void 0 : _a[0];
  });
  const endValue = vue.computed(() => {
    var _a;
    return (_a = value.value) == null ? void 0 : _a[1];
  });
  const startDefaultValue = vue.computed(() => {
    var _a;
    return (_a = defaultValue.value) == null ? void 0 : _a[0];
  });
  const endDefaultValue = vue.computed(() => {
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
    vue.reactive({
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
    vue.reactive({
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
    let [header02, header12] = date.getSortedDayjsArray(values);
    const nextHeader = date.methods.add(header02, span.value, "M");
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
      [selected02, selected12] = date.getSortedDayjsArray([selected02, selected12]);
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
    vue.nextTick(() => {
      const [selected02, selected12] = getFormSelectedValue();
      const [header02, header12] = getFixedValue([
        selected02 || defaultStartHeaderValue,
        selected12 || defaultEndHeaderValue
      ]);
      setHeaderValue([header02, header12]);
    });
  };
  const canShortenMonth = vue.computed(
    () => date.methods.add(startHeaderValue.value, span.value, "M").isBefore(endHeaderValue.value, unit.value)
  );
  const canShortenYear = vue.computed(
    () => date.methods.add(startHeaderValue.value, superSpan.value, "M").isBefore(endHeaderValue.value, unit.value)
  );
  const computedStartHeaderOperations = vue.computed(() => {
    const operations = ["onSuperPrev"];
    if (isDateOrWeek.value)
      operations.push("onPrev");
    if (canShortenMonth.value && isDateOrWeek)
      operations.push("onNext");
    if (canShortenYear.value)
      operations.push("onSuperNext");
    return pick(startHeaderOperations.value, operations);
  });
  const computedEndHeaderOperations = vue.computed(() => {
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
module.exports = useRangeHeaderValue;
