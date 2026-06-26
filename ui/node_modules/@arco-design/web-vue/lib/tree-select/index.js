"use strict";
var globalConfig = require("../_utils/global-config.js");
var treeSelect = require("./tree-select.js");
const TreeSelect = Object.assign(treeSelect, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + treeSelect.name, treeSelect);
  }
});
module.exports = TreeSelect;
