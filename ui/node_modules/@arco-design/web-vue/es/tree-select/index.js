import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _TreeSelect from "./tree-select.js";
const TreeSelect = Object.assign(_TreeSelect, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _TreeSelect.name, _TreeSelect);
  }
});
export { TreeSelect as default };
