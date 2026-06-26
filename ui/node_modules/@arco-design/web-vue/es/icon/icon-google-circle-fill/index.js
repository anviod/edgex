import _IconGoogleCircleFill from "./icon-google-circle-fill.js";
const IconGoogleCircleFill = Object.assign(_IconGoogleCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconGoogleCircleFill.name, _IconGoogleCircleFill);
  }
});
export { IconGoogleCircleFill as default };
