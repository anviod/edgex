import _IconDoubleDown from "./icon-double-down.js";
const IconDoubleDown = Object.assign(_IconDoubleDown, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconDoubleDown.name, _IconDoubleDown);
  }
});
export { IconDoubleDown as default };
