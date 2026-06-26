"use strict";
var iconSkipPreviousFill = require("./icon-skip-previous-fill.js");
const IconSkipPreviousFill = Object.assign(iconSkipPreviousFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSkipPreviousFill.name, iconSkipPreviousFill);
  }
});
module.exports = IconSkipPreviousFill;
