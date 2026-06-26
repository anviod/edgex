import _IconEraser from "./icon-eraser.js";
const IconEraser = Object.assign(_IconEraser, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconEraser.name, _IconEraser);
  }
});
export { IconEraser as default };
