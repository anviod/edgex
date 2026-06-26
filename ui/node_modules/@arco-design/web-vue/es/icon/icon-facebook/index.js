import _IconFacebook from "./icon-facebook.js";
const IconFacebook = Object.assign(_IconFacebook, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFacebook.name, _IconFacebook);
  }
});
export { IconFacebook as default };
