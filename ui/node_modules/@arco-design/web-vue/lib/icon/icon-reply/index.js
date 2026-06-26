"use strict";
var iconReply = require("./icon-reply.js");
const IconReply = Object.assign(iconReply, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconReply.name, iconReply);
  }
});
module.exports = IconReply;
