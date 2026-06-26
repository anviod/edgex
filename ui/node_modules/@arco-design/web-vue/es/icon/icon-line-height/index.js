import _IconLineHeight from "./icon-line-height.js";
const IconLineHeight = Object.assign(_IconLineHeight, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconLineHeight.name, _IconLineHeight);
  }
});
export { IconLineHeight as default };
