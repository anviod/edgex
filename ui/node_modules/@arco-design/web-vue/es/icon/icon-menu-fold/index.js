import _IconMenuFold from "./icon-menu-fold.js";
const IconMenuFold = Object.assign(_IconMenuFold, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconMenuFold.name, _IconMenuFold);
  }
});
export { IconMenuFold as default };
