import _IconLeftCircle from "./icon-left-circle.js";
const IconLeftCircle = Object.assign(_IconLeftCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconLeftCircle.name, _IconLeftCircle);
  }
});
export { IconLeftCircle as default };
