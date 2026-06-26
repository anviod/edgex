import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Radio from "./radio.js";
import RadioGroup from "./radio-group.js";
export { default as RadioGroup } from "./radio-group.js";
const Radio = Object.assign(_Radio, {
  Group: RadioGroup,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Radio.name, _Radio);
    app.component(componentPrefix + RadioGroup.name, RadioGroup);
  }
});
export { Radio as default };
