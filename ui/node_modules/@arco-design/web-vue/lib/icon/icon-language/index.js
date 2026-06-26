"use strict";
var iconLanguage = require("./icon-language.js");
const IconLanguage = Object.assign(iconLanguage, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconLanguage.name, iconLanguage);
  }
});
module.exports = IconLanguage;
