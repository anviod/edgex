import _IconToTop from "./icon-to-top.js";
const IconToTop = Object.assign(_IconToTop, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconToTop.name, _IconToTop);
  }
});
export { IconToTop as default };
