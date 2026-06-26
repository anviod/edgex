import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Divider from "./divider.js";
const Divider = Object.assign(_Divider, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Divider.name, _Divider);
  }
});
export { Divider as default };
