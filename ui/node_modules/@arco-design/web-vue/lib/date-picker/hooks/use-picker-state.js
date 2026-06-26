"use strict";
var vue = require("vue");
var date = require("../../_utils/date.js");
var is = require("../../_utils/is.js");
var useState = require("../../_hooks/use-state.js");
function usePickerState(props) {
  const { modelValue, defaultValue, format } = vue.toRefs(props);
  const computedModelValue = vue.computed(() => {
    return date.getDayjsValue(modelValue.value, format.value);
  });
  const computedDefaultValue = vue.computed(() => {
    return date.getDayjsValue(defaultValue.value, format.value);
  });
  const [localValue, setLocalValue] = useState(
    !is.isUndefined(computedModelValue.value) ? computedModelValue.value : !is.isUndefined(computedDefaultValue.value) ? computedDefaultValue.value : void 0
  );
  vue.watch(computedModelValue, () => {
    if (is.isUndefined(computedModelValue.value)) {
      setLocalValue(void 0);
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
module.exports = usePickerState;
