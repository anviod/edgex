import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Result from "./result.js";
const Result = Object.assign(_Result, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Result.name, _Result);
  }
});
export { Result as default };
