import _IconRotateLeft from "./icon-rotate-left.js";
const IconRotateLeft = Object.assign(_IconRotateLeft, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconRotateLeft.name, _IconRotateLeft);
  }
});
export { IconRotateLeft as default };
