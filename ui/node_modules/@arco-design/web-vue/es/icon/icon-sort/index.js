import _IconSort from "./icon-sort.js";
const IconSort = Object.assign(_IconSort, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSort.name, _IconSort);
  }
});
export { IconSort as default };
