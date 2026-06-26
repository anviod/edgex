import _IconFullscreen from "./icon-fullscreen.js";
const IconFullscreen = Object.assign(_IconFullscreen, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFullscreen.name, _IconFullscreen);
  }
});
export { IconFullscreen as default };
