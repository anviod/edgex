import _IconCopyright from "./icon-copyright.js";
const IconCopyright = Object.assign(_IconCopyright, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCopyright.name, _IconCopyright);
  }
});
export { IconCopyright as default };
