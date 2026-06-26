import _IconLeft from "./icon-left.js";
const IconLeft = Object.assign(_IconLeft, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconLeft.name, _IconLeft);
  }
});
export { IconLeft as default };
