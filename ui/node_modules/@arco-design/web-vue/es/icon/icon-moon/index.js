import _IconMoon from "./icon-moon.js";
const IconMoon = Object.assign(_IconMoon, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconMoon.name, _IconMoon);
  }
});
export { IconMoon as default };
