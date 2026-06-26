"use strict";
var iconEnglishFill = require("./icon-english-fill.js");
const IconEnglishFill = Object.assign(iconEnglishFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconEnglishFill.name, iconEnglishFill);
  }
});
module.exports = IconEnglishFill;
