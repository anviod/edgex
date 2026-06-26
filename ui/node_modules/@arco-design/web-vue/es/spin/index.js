import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Spin from "./spin.js";
const Spin = Object.assign(_Spin, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Spin.name, _Spin);
  }
});
export { Spin as default };
