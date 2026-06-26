import _IconExclamationCircle from "./icon-exclamation-circle.js";
const IconExclamationCircle = Object.assign(_IconExclamationCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconExclamationCircle.name, _IconExclamationCircle);
  }
});
export { IconExclamationCircle as default };
