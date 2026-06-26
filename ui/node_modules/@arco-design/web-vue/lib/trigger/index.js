"use strict";
var globalConfig = require("../_utils/global-config.js");
var trigger = require("./trigger.js");
const Trigger = Object.assign(trigger, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + trigger.name, trigger);
  }
});
module.exports = Trigger;
