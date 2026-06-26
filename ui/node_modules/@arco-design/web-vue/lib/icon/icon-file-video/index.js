"use strict";
var iconFileVideo = require("./icon-file-video.js");
const IconFileVideo = Object.assign(iconFileVideo, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFileVideo.name, iconFileVideo);
  }
});
module.exports = IconFileVideo;
