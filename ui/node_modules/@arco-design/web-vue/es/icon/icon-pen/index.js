import _IconPen from "./icon-pen.js";
const IconPen = Object.assign(_IconPen, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconPen.name, _IconPen);
  }
});
export { IconPen as default };
