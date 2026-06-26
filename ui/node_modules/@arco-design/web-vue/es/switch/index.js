import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Switch from "./switch.js";
const Switch = Object.assign(_Switch, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Switch.name, _Switch);
  }
});
export { Switch as default };
