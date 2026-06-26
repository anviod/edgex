import _IconMoonFill from "./icon-moon-fill.js";
const IconMoonFill = Object.assign(_IconMoonFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconMoonFill.name, _IconMoonFill);
  }
});
export { IconMoonFill as default };
