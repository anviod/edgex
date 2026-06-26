import _IconFileVideo from "./icon-file-video.js";
const IconFileVideo = Object.assign(_IconFileVideo, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFileVideo.name, _IconFileVideo);
  }
});
export { IconFileVideo as default };
