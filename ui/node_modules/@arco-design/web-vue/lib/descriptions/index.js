"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var descriptions = require("./descriptions.js");
var descriptionsItem = require("./descriptions-item.js");
const Descriptions = Object.assign(descriptions, {
  DescriptionsItem: descriptionsItem,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + descriptions.name, descriptions);
    app.component(componentPrefix + descriptionsItem.name, descriptionsItem);
  }
});
exports.DescriptionsItem = descriptionsItem;
exports["default"] = Descriptions;
