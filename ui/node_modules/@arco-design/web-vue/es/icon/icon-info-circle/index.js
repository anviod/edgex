import _IconInfoCircle from "./icon-info-circle.js";
const IconInfoCircle = Object.assign(_IconInfoCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconInfoCircle.name, _IconInfoCircle);
  }
});
export { IconInfoCircle as default };
