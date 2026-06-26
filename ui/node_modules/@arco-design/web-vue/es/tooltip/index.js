import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Tooltip from "./tooltip.js";
const Tooltip = Object.assign(_Tooltip, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Tooltip.name, _Tooltip);
  }
});
export { Tooltip as default };
