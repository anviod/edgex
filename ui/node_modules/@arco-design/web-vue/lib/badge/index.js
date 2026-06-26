"use strict";
var globalConfig = require("../_utils/global-config.js");
var badge = require("./badge.js");
const Badge = Object.assign(badge["default"], {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + badge["default"].name, badge["default"]);
  }
});
module.exports = Badge;
