import _IconAlignCenter from "./icon-align-center.js";
const IconAlignCenter = Object.assign(_IconAlignCenter, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconAlignCenter.name, _IconAlignCenter);
  }
});
export { IconAlignCenter as default };
