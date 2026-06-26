import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Select from "./select.js";
import Option from "./option.js";
export { default as Option } from "./option.js";
import Optgroup from "./optgroup.js";
export { default as Optgroup } from "./optgroup.js";
const Select = Object.assign(_Select, {
  Option,
  OptGroup: Optgroup,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Select.name, _Select);
    app.component(componentPrefix + Option.name, Option);
    app.component(componentPrefix + Optgroup.name, Optgroup);
  }
});
export { Select as default };
