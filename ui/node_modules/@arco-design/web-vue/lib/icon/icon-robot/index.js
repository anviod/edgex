"use strict";
var iconRobot = require("./icon-robot.js");
const IconRobot = Object.assign(iconRobot, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconRobot.name, iconRobot);
  }
});
module.exports = IconRobot;
