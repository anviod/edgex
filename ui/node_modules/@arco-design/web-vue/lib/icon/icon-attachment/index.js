"use strict";
var iconAttachment = require("./icon-attachment.js");
const IconAttachment = Object.assign(iconAttachment, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconAttachment.name, iconAttachment);
  }
});
module.exports = IconAttachment;
