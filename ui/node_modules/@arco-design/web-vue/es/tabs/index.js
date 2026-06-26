import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Tabs from "./tabs.js";
import TabPane from "./tab-pane.js";
export { default as TabPane } from "./tab-pane.js";
const Tabs = Object.assign(_Tabs, {
  TabPane,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Tabs.name, _Tabs);
    app.component(componentPrefix + TabPane.name, TabPane);
  }
});
export { Tabs as default };
