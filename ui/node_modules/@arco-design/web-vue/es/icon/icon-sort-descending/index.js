import _IconSortDescending from "./icon-sort-descending.js";
const IconSortDescending = Object.assign(_IconSortDescending, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSortDescending.name, _IconSortDescending);
  }
});
export { IconSortDescending as default };
