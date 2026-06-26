import _IconVideoCamera from "./icon-video-camera.js";
const IconVideoCamera = Object.assign(_IconVideoCamera, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconVideoCamera.name, _IconVideoCamera);
  }
});
export { IconVideoCamera as default };
