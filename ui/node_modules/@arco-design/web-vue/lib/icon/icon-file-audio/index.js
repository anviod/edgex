"use strict";
var iconFileAudio = require("./icon-file-audio.js");
const IconFileAudio = Object.assign(iconFileAudio, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFileAudio.name, iconFileAudio);
  }
});
module.exports = IconFileAudio;
