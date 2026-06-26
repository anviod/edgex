import _IconDoubleUp from "./icon-double-up.js";
const IconDoubleUp = Object.assign(_IconDoubleUp, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconDoubleUp.name, _IconDoubleUp);
  }
});
export { IconDoubleUp as default };
