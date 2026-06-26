"use strict";
var iconRedo = require("./icon-redo.js");
const IconRedo = Object.assign(iconRedo, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconRedo.name, iconRedo);
  }
});
module.exports = IconRedo;
