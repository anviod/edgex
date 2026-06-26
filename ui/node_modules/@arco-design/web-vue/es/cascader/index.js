import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Cascader from "./cascader.js";
import CascaderPanel from "./cascader-panel.js";
export { default as CascaderPanel } from "./cascader-panel.js";
const Cascader = Object.assign(_Cascader, {
  CascaderPanel,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Cascader.name, _Cascader);
    app.component(componentPrefix + CascaderPanel.name, CascaderPanel);
  }
});
export { Cascader as default };
