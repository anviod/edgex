import _IconSunFill from "./icon-sun-fill.js";
const IconSunFill = Object.assign(_IconSunFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSunFill.name, _IconSunFill);
  }
});
export { IconSunFill as default };
