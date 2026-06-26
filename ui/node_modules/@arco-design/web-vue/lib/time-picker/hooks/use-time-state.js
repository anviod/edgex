"use strict";
var vue = require("vue");
var date = require("../../_utils/date.js");
var is = require("../../_utils/is.js");
var useState = require("../../_hooks/use-state.js");
function useTimeState(props) {
  const { modelValue, defaultValue, format, isRange } = vue.toRefs(props);
  function getLocalEmptyValue() {
    return isRange.value ? [] : void 0;
  }
  function normalizeValue(time) {
    if (is.isUndefined(time)) {
      return void 0;
    }
    if (isRange.value) {
      return is.isArray(time) ? time : [time, void 0];
    }
    return time;
  }
  const computedModelValue = vue.computed(() => {
    const time = normalizeValue(modelValue.value);
    return date.getDayjsValue(time, format.value);
  });
  const computedDefaultValue = vue.computed(() => {
    const time = normalizeValue(defaultValue.value);
    return date.getDayjsValue(time, format.value);
  });
  const [localValue, setLocalValue] = useState(
    !is.isUndefined(computedModelValue.value) ? computedModelValue.value : !is.isUndefined(computedDefaultValue.value) ? computedDefaultValue.value : getLocalEmptyValue()
  );
  vue.watch(computedModelValue, () => {
    if (is.isUndefined(computedModelValue.value)) {
      setLocalValue(getLocalEmptyValue());
    }
  });
  const computedValue = vue.computed(
    () => computedModelValue.value || localValue.value
  );
  const [panelValue, setPanelValue] = useState(computedValue.value);
  vue.watch([computedValue], () => {
    setPanelValue(computedValue.value);
  });
  const [inputValue, setInputValue] = useState();
  vue.watch([panelValue], () => {
    setInputValue(void 0);
  });
  return {
    computedValue,
    panelValue,
    inputValue,
    setValue: setLocalValue,
    setPanelValue,
    setInputValue
  };
}
module.exports = useTimeState;
