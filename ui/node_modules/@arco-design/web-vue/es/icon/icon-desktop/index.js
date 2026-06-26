import _IconDesktop from "./icon-desktop.js";
const IconDesktop = Object.assign(_IconDesktop, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconDesktop.name, _IconDesktop);
  }
});
export { IconDesktop as default };
