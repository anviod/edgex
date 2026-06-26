"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var breadcrumb = require("./breadcrumb.js");
var breadcrumbItem = require("./breadcrumb-item.js");
const Breadcrumb = Object.assign(breadcrumb, {
  Item: breadcrumbItem,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + breadcrumb.name, breadcrumb);
    app.component(componentPrefix + breadcrumbItem.name, breadcrumbItem);
  }
});
exports.BreadcrumbItem = breadcrumbItem;
exports["default"] = Breadcrumb;
