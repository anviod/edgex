import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _InputNumber from "./input-number.js";
const InputNumber = Object.assign(_InputNumber, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _InputNumber.name, _InputNumber);
  }
});
export { InputNumber as default };
