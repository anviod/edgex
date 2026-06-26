import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _AutoComplete from "./auto-complete.js";
const AutoComplete = Object.assign(_AutoComplete, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _AutoComplete.name, _AutoComplete);
  }
});
export { AutoComplete as default };
