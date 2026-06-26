import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Space from "./space.js";
const Space = Object.assign(_Space, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Space.name, _Space);
  }
});
export { Space as default };
