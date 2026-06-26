import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Slider from "./slider.js";
const Slider = Object.assign(_Slider, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Slider.name, _Slider);
  }
});
export { Slider as default };
