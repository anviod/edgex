import _IconMenu from "./icon-menu.js";
const IconMenu = Object.assign(_IconMenu, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconMenu.name, _IconMenu);
  }
});
export { IconMenu as default };
