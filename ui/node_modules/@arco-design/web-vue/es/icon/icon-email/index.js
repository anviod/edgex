import _IconEmail from "./icon-email.js";
const IconEmail = Object.assign(_IconEmail, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconEmail.name, _IconEmail);
  }
});
export { IconEmail as default };
