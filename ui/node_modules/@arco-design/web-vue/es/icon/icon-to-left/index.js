import _IconToLeft from "./icon-to-left.js";
const IconToLeft = Object.assign(_IconToLeft, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconToLeft.name, _IconToLeft);
  }
});
export { IconToLeft as default };
