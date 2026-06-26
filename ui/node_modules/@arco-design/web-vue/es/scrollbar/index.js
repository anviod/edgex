import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Scrollbar from "./scrollbar.js";
const Scrollbar = Object.assign(_Scrollbar, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Scrollbar.name, _Scrollbar);
  }
});
export { Scrollbar as default };
