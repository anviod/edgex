"use strict";
var globalConfig = require("../_utils/global-config.js");
var alert = require("./alert.js");
const Alert = Object.assign(alert, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + alert.name, alert);
  }
});
module.exports = Alert;
