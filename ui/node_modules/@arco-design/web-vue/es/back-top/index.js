import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _BackTop from "./back-top.js";
const BackTop = Object.assign(_BackTop, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _BackTop.name, _BackTop);
  }
});
export { BackTop as default };
