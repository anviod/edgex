import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Affix from "./affix.js";
const Affix = Object.assign(_Affix, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Affix.name, _Affix);
  }
});
export { Affix as default };
