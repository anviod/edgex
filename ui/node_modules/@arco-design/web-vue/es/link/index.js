import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Link from "./link.js";
const Link = Object.assign(_Link, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Link.name, _Link);
  }
});
export { Link as default };
