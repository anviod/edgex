"use strict";
var iconSave = require("./icon-save.js");
const IconSave = Object.assign(iconSave, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSave.name, iconSave);
  }
});
module.exports = IconSave;
