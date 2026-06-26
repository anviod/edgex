import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Watermark from "./watermark.js";
const Watermark = Object.assign(_Watermark, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Watermark.name, _Watermark);
  }
});
export { Watermark as default };
