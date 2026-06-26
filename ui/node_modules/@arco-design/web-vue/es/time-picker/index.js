import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _TimePicker from "./time-picker.js";
const TimePicker = Object.assign(_TimePicker, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _TimePicker.name, _TimePicker);
  }
});
export { TimePicker as default };
