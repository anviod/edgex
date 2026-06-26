import _IconQqCircleFill from "./icon-qq-circle-fill.js";
const IconQqCircleFill = Object.assign(_IconQqCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconQqCircleFill.name, _IconQqCircleFill);
  }
});
export { IconQqCircleFill as default };
