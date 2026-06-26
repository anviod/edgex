import _IconDragDot from "./icon-drag-dot.js";
const IconDragDot = Object.assign(_IconDragDot, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconDragDot.name, _IconDragDot);
  }
});
export { IconDragDot as default };
