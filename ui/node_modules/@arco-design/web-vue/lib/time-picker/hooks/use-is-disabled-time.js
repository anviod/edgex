"use strict";
var is = require("../../_utils/is.js");
var index = require("../utils/index.js");
function useIsDisabledTime(props) {
  const isDisabled = (value) => {
    return index.isDisabledTime(value, {
      disabledHours: props.disabledHours,
      disabledMinutes: props.disabledMinutes,
      disabledSeconds: props.disabledSeconds
    });
  };
  return (value) => {
    return is.isArray(value) ? value.some((i) => isDisabled(i)) : isDisabled(value);
  };
}
module.exports = useIsDisabledTime;
