"use strict";
var globalConfig = require("../_utils/global-config.js");
var popover = require("./popover.js");
const Popover = Object.assign(popover, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + popover.name, popover);
  }
});
module.exports = Popover;
