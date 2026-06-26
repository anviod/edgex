"use strict";
var iconRobotAdd = require("./icon-robot-add.js");
const IconRobotAdd = Object.assign(iconRobotAdd, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconRobotAdd.name, iconRobotAdd);
  }
});
module.exports = IconRobotAdd;
