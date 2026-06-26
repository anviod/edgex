import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Trigger from "./trigger.js";
const Trigger = Object.assign(_Trigger, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Trigger.name, _Trigger);
  }
});
export { Trigger as default };
