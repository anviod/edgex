"use strict";
var iconVoice = require("./icon-voice.js");
const IconVoice = Object.assign(iconVoice, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconVoice.name, iconVoice);
  }
});
module.exports = IconVoice;
