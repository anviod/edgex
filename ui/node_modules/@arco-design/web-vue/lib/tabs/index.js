"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var tabs = require("./tabs.js");
var tabPane = require("./tab-pane.js");
const Tabs = Object.assign(tabs, {
  TabPane: tabPane,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + tabs.name, tabs);
    app.component(componentPrefix + tabPane.name, tabPane);
  }
});
exports.TabPane = tabPane;
exports["default"] = Tabs;
