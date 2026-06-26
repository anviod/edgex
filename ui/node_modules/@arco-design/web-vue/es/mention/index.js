import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Mention from "./mention.js";
const Mention = Object.assign(_Mention, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Mention.name, _Mention);
  }
});
export { Mention as default };
