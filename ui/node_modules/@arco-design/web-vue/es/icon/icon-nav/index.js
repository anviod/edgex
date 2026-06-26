import _IconNav from "./icon-nav.js";
const IconNav = Object.assign(_IconNav, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconNav.name, _IconNav);
  }
});
export { IconNav as default };
