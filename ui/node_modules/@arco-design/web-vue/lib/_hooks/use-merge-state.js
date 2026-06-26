"use strict";
var vue = require("vue");
var is = require("../_utils/is.js");
var useState = require("./use-state.js");
function useMergeState(defaultValue, props) {
  const { value } = vue.toRefs(props);
  const [localValue, setLocalValue] = useState(
    !is.isUndefined(value.value) ? value.value : defaultValue
  );
  vue.watch(value, (newVal) => {
    is.isUndefined(newVal) && setLocalValue(void 0);
  });
  const mergeValue = vue.computed(
    () => !is.isUndefined(value.value) ? value.value : localValue.value
  );
  return [mergeValue, setLocalValue, localValue];
}
module.exports = useMergeState;
