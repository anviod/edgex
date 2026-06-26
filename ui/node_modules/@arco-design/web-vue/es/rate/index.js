import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Rate from "./rate.js";
const Rate = Object.assign(_Rate, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Rate.name, _Rate);
  }
});
export { Rate as default };
