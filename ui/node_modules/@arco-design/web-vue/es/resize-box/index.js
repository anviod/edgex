import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _ResizeBox from "./resize-box.js";
const ResizeBox = Object.assign(_ResizeBox, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _ResizeBox.name, _ResizeBox);
  }
});
export { ResizeBox as default };
