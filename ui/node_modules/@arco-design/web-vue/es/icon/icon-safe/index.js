import _IconSafe from "./icon-safe.js";
const IconSafe = Object.assign(_IconSafe, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSafe.name, _IconSafe);
  }
});
export { IconSafe as default };
