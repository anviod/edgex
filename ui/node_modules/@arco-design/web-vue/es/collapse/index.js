import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Collapse from "./collapse.js";
import CollapseItem from "./collapse-item.js";
export { default as CollapseItem } from "./collapse-item.js";
const Collapse = Object.assign(_Collapse, {
  Item: CollapseItem,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Collapse.name, _Collapse);
    app.component(componentPrefix + CollapseItem.name, CollapseItem);
  }
});
export { Collapse as default };
