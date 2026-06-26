import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _ColorPicker from "./color-picker.js";
const ColorPicker = Object.assign(_ColorPicker, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _ColorPicker.name, _ColorPicker);
  }
});
export { ColorPicker as default };
