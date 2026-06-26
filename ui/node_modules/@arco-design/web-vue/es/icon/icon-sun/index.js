import _IconSun from "./icon-sun.js";
const IconSun = Object.assign(_IconSun, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSun.name, _IconSun);
  }
});
export { IconSun as default };
