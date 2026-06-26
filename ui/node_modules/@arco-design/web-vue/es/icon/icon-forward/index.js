import _IconForward from "./icon-forward.js";
const IconForward = Object.assign(_IconForward, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconForward.name, _IconForward);
  }
});
export { IconForward as default };
