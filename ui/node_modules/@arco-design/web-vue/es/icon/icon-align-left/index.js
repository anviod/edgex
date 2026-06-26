import _IconAlignLeft from "./icon-align-left.js";
const IconAlignLeft = Object.assign(_IconAlignLeft, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconAlignLeft.name, _IconAlignLeft);
  }
});
export { IconAlignLeft as default };
