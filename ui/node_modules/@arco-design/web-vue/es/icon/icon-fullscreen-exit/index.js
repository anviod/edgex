import _IconFullscreenExit from "./icon-fullscreen-exit.js";
const IconFullscreenExit = Object.assign(_IconFullscreenExit, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFullscreenExit.name, _IconFullscreenExit);
  }
});
export { IconFullscreenExit as default };
