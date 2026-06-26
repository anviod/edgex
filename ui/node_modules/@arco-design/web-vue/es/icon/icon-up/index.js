import _IconUp from "./icon-up.js";
const IconUp = Object.assign(_IconUp, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconUp.name, _IconUp);
  }
});
export { IconUp as default };
