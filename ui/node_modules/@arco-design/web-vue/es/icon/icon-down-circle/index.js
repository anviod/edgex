import _IconDownCircle from "./icon-down-circle.js";
const IconDownCircle = Object.assign(_IconDownCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconDownCircle.name, _IconDownCircle);
  }
});
export { IconDownCircle as default };
