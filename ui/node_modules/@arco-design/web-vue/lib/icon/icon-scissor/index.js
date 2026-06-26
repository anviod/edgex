"use strict";
var iconScissor = require("./icon-scissor.js");
const IconScissor = Object.assign(iconScissor, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconScissor.name, iconScissor);
  }
});
module.exports = IconScissor;
