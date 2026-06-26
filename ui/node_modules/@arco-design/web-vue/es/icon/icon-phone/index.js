import _IconPhone from "./icon-phone.js";
const IconPhone = Object.assign(_IconPhone, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconPhone.name, _IconPhone);
  }
});
export { IconPhone as default };
