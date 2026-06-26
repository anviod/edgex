import _IconSelectAll from "./icon-select-all.js";
const IconSelectAll = Object.assign(_IconSelectAll, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSelectAll.name, _IconSelectAll);
  }
});
export { IconSelectAll as default };
