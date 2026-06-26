"use strict";
var iconEmail = require("./icon-email.js");
const IconEmail = Object.assign(iconEmail, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconEmail.name, iconEmail);
  }
});
module.exports = IconEmail;
