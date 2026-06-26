import _IconCheck from "./icon-check.js";
const IconCheck = Object.assign(_IconCheck, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCheck.name, _IconCheck);
  }
});
export { IconCheck as default };
