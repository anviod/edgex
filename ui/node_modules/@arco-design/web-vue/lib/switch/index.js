"use strict";
var globalConfig = require("../_utils/global-config.js");
var _switch = require("./switch.js");
const Switch = Object.assign(_switch, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + _switch.name, _switch);
  }
});
module.exports = Switch;
