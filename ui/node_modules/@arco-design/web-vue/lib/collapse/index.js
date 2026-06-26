"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var collapse = require("./collapse.js");
var collapseItem = require("./collapse-item.js");
const Collapse = Object.assign(collapse, {
  Item: collapseItem,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + collapse.name, collapse);
    app.component(componentPrefix + collapseItem.name, collapseItem);
  }
});
exports.CollapseItem = collapseItem;
exports["default"] = Collapse;
