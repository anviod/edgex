import _IconFacebookSquareFill from "./icon-facebook-square-fill.js";
const IconFacebookSquareFill = Object.assign(_IconFacebookSquareFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFacebookSquareFill.name, _IconFacebookSquareFill);
  }
});
export { IconFacebookSquareFill as default };
