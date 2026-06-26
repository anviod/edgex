import _IconDragArrow from "./icon-drag-arrow.js";
const IconDragArrow = Object.assign(_IconDragArrow, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconDragArrow.name, _IconDragArrow);
  }
});
export { IconDragArrow as default };
