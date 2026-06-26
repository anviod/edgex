import _IconMobile from "./icon-mobile.js";
const IconMobile = Object.assign(_IconMobile, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconMobile.name, _IconMobile);
  }
});
export { IconMobile as default };
