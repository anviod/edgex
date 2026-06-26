import _IconEar from "./icon-ear.js";
const IconEar = Object.assign(_IconEar, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconEar.name, _IconEar);
  }
});
export { IconEar as default };
