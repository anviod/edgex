"use strict";
var globalConfig = require("../_utils/global-config.js");
var divider = require("./divider.js");
const Divider = Object.assign(divider, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + divider.name, divider);
  }
});
module.exports = Divider;
