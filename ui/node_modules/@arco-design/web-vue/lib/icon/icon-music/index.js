"use strict";
var iconMusic = require("./icon-music.js");
const IconMusic = Object.assign(iconMusic, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMusic.name, iconMusic);
  }
});
module.exports = IconMusic;
