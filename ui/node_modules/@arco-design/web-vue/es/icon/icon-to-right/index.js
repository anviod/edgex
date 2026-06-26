import _IconToRight from "./icon-to-right.js";
const IconToRight = Object.assign(_IconToRight, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconToRight.name, _IconToRight);
  }
});
export { IconToRight as default };
