import _IconCamera from "./icon-camera.js";
const IconCamera = Object.assign(_IconCamera, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCamera.name, _IconCamera);
  }
});
export { IconCamera as default };
