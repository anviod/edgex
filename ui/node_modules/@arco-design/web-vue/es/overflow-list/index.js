import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _OverflowList from "./overflow-list.js";
const OverflowList = Object.assign(_OverflowList, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _OverflowList.name, _OverflowList);
  }
});
export { OverflowList as default };
