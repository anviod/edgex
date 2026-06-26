import _IconZoomOut from "./icon-zoom-out.js";
const IconZoomOut = Object.assign(_IconZoomOut, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconZoomOut.name, _IconZoomOut);
  }
});
export { IconZoomOut as default };
