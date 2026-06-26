import _IconCheckCircle from "./icon-check-circle.js";
const IconCheckCircle = Object.assign(_IconCheckCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCheckCircle.name, _IconCheckCircle);
  }
});
export { IconCheckCircle as default };
