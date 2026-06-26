"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var cascader = require("./cascader.js");
var cascaderPanel = require("./cascader-panel.js");
const Cascader = Object.assign(cascader, {
  CascaderPanel: cascaderPanel,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + cascader.name, cascader);
    app.component(componentPrefix + cascaderPanel.name, cascaderPanel);
  }
});
exports.CascaderPanel = cascaderPanel;
exports["default"] = Cascader;
