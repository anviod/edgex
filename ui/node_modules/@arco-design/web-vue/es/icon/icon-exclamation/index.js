import _IconExclamation from "./icon-exclamation.js";
const IconExclamation = Object.assign(_IconExclamation, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconExclamation.name, _IconExclamation);
  }
});
export { IconExclamation as default };
