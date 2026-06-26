import { isArray } from "../../_utils/is.js";
import { isDisabledTime } from "../utils/index.js";
function useIsDisabledTime(props) {
  const isDisabled = (value) => {
    return isDisabledTime(value, {
      disabledHours: props.disabledHours,
      disabledMinutes: props.disabledMinutes,
      disabledSeconds: props.disabledSeconds
    });
  };
  return (value) => {
    return isArray(value) ? value.some((i) => isDisabled(i)) : isDisabled(value);
  };
}
export { useIsDisabledTime as default };
