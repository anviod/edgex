import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Checkbox from "./checkbox.js";
import CheckboxGroup from "./checkbox-group.js";
export { default as CheckboxGroup } from "./checkbox-group.js";
const Checkbox = Object.assign(_Checkbox, {
  Group: CheckboxGroup,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Checkbox.name, _Checkbox);
    app.component(componentPrefix + CheckboxGroup.name, CheckboxGroup);
  }
});
export { Checkbox as default };
