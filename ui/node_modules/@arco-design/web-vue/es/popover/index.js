import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Popover from "./popover.js";
const Popover = Object.assign(_Popover, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Popover.name, _Popover);
  }
});
export { Popover as default };
