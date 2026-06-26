import _IconEye from "./icon-eye.js";
const IconEye = Object.assign(_IconEye, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconEye.name, _IconEye);
  }
});
export { IconEye as default };
