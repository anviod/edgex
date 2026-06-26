import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Alert from "./alert.js";
const Alert = Object.assign(_Alert, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Alert.name, _Alert);
  }
});
export { Alert as default };
