import _IconCompass from "./icon-compass.js";
const IconCompass = Object.assign(_IconCompass, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCompass.name, _IconCompass);
  }
});
export { IconCompass as default };
