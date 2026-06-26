import _IconDoubleLeft from "./icon-double-left.js";
const IconDoubleLeft = Object.assign(_IconDoubleLeft, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconDoubleLeft.name, _IconDoubleLeft);
  }
});
export { IconDoubleLeft as default };
