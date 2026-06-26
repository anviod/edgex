import _IconBrush from "./icon-brush.js";
const IconBrush = Object.assign(_IconBrush, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconBrush.name, _IconBrush);
  }
});
export { IconBrush as default };
