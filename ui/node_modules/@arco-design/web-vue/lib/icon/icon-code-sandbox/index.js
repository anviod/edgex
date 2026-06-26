"use strict";
var iconCodeSandbox = require("./icon-code-sandbox.js");
const IconCodeSandbox = Object.assign(iconCodeSandbox, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCodeSandbox.name, iconCodeSandbox);
  }
});
module.exports = IconCodeSandbox;
