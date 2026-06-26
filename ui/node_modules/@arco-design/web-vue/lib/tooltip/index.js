"use strict";
var globalConfig = require("../_utils/global-config.js");
var tooltip = require("./tooltip.js");
const Tooltip = Object.assign(tooltip, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + tooltip.name, tooltip);
  }
});
module.exports = Tooltip;
