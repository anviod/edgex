import _IconHome from "./icon-home.js";
const IconHome = Object.assign(_IconHome, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconHome.name, _IconHome);
  }
});
export { IconHome as default };
