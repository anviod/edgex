import _IconMenuUnfold from "./icon-menu-unfold.js";
const IconMenuUnfold = Object.assign(_IconMenuUnfold, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconMenuUnfold.name, _IconMenuUnfold);
  }
});
export { IconMenuUnfold as default };
