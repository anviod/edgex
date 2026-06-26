import _IconCloseCircle from "./icon-close-circle.js";
const IconCloseCircle = Object.assign(_IconCloseCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCloseCircle.name, _IconCloseCircle);
  }
});
export { IconCloseCircle as default };
