"use strict";
var iconTranslate = require("./icon-translate.js");
const IconTranslate = Object.assign(iconTranslate, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconTranslate.name, iconTranslate);
  }
});
module.exports = IconTranslate;
