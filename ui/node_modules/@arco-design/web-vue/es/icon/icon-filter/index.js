import _IconFilter from "./icon-filter.js";
const IconFilter = Object.assign(_IconFilter, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFilter.name, _IconFilter);
  }
});
export { IconFilter as default };
