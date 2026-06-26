import _IconChineseFill from "./icon-chinese-fill.js";
const IconChineseFill = Object.assign(_IconChineseFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconChineseFill.name, _IconChineseFill);
  }
});
export { IconChineseFill as default };
