import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Textarea from "./textarea.js";
const Textarea = Object.assign(_Textarea, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Textarea.name, _Textarea);
  }
});
export { Textarea as default };
