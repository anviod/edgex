"use strict";
var iconUpload = require("./icon-upload.js");
const IconUpload = Object.assign(iconUpload, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconUpload.name, iconUpload);
  }
});
module.exports = IconUpload;
