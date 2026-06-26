import _IconExclamationPolygonFill from "./icon-exclamation-polygon-fill.js";
const IconExclamationPolygonFill = Object.assign(_IconExclamationPolygonFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconExclamationPolygonFill.name, _IconExclamationPolygonFill);
  }
});
export { IconExclamationPolygonFill as default };
