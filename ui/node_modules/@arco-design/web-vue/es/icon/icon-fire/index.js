import _IconFire from "./icon-fire.js";
const IconFire = Object.assign(_IconFire, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFire.name, _IconFire);
  }
});
export { IconFire as default };
