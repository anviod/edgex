import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Split from "./split.js";
const Split = Object.assign(_Split, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Split.name, _Split);
  }
});
export { Split as default };
