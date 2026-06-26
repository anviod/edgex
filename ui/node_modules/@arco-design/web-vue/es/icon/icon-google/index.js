import _IconGoogle from "./icon-google.js";
const IconGoogle = Object.assign(_IconGoogle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconGoogle.name, _IconGoogle);
  }
});
export { IconGoogle as default };
