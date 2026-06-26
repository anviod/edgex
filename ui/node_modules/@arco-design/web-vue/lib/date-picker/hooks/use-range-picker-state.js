"use strict";
var vue = require("vue");
var index = require("../utils/index.js");
var date = require("../../_utils/date.js");
var is = require("../../_utils/is.js");
var useState = require("../../_hooks/use-state.js");
function useRangePickerState(props) {
  const { modelValue, defaultValue, format } = vue.toRefs(props);
  const computedModelValue = vue.computed(() => {
    return date.getDayjsValue(index.normalizeRangeValue(modelValue.value), format.value);
  });
  const computedDefaultValue = vue.computed(() => {
    return date.getDayjsValue(index.normalizeRangeValue(defaultValue.value), format.value);
  });
  const [localValue, setLocalValue] = useState(
    !is.isUndefined(computedModelValue.value) ? computedModelValue.value : !is.isUndefined(computedDefaultValue.value) ? computedDefaultValue.value : []
  );
  vue.watch(computedModelValue, () => {
    if (is.isUndefined(computedModelValue.value)) {
      setLocalValue([]);
    }
  });
  const mergeValue = vue.computed(
    () => computedModelValue.value || localValue.value
  );
  return {
    value: mergeValue,
    setValue: setLocalValue
  };
}
module.exports = useRangePickerState;
