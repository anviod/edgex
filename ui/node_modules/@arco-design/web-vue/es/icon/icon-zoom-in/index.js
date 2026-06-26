import _IconZoomIn from "./icon-zoom-in.js";
const IconZoomIn = Object.assign(_IconZoomIn, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconZoomIn.name, _IconZoomIn);
  }
});
export { IconZoomIn as default };
