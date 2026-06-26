import _IconBackward from "./icon-backward.js";
const IconBackward = Object.assign(_IconBackward, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconBackward.name, _IconBackward);
  }
});
export { IconBackward as default };
