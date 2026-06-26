import _IconSortAscending from "./icon-sort-ascending.js";
const IconSortAscending = Object.assign(_IconSortAscending, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSortAscending.name, _IconSortAscending);
  }
});
export { IconSortAscending as default };
