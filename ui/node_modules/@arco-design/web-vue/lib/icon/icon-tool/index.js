"use strict";
var iconTool = require("./icon-tool.js");
const IconTool = Object.assign(iconTool, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconTool.name, iconTool);
  }
});
module.exports = IconTool;
