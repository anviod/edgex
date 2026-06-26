"use strict";
var iconPhone = require("./icon-phone.js");
const IconPhone = Object.assign(iconPhone, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPhone.name, iconPhone);
  }
});
module.exports = IconPhone;
