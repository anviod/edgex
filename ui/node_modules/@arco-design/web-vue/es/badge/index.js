import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Badge from "./badge.js";
const Badge = Object.assign(_Badge, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Badge.name, _Badge);
  }
});
export { Badge as default };
