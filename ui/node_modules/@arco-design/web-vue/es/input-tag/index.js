import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _InputTag from "./input-tag.js";
const InputTag = Object.assign(_InputTag, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _InputTag.name, _InputTag);
  }
});
export { InputTag as default };
