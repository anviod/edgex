import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Progress from "./progress.js";
const Progress = Object.assign(_Progress, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Progress.name, _Progress);
  }
});
export { Progress as default };
