import _IconDragDotVertical from "./icon-drag-dot-vertical.js";
const IconDragDotVertical = Object.assign(_IconDragDotVertical, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconDragDotVertical.name, _IconDragDotVertical);
  }
});
export { IconDragDotVertical as default };
