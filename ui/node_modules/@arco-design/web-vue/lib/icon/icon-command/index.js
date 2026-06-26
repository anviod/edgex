"use strict";
var iconCommand = require("./icon-command.js");
const IconCommand = Object.assign(iconCommand, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCommand.name, iconCommand);
  }
});
module.exports = IconCommand;
