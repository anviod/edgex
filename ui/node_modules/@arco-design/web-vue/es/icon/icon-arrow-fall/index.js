import _IconArrowFall from "./icon-arrow-fall.js";
const IconArrowFall = Object.assign(_IconArrowFall, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconArrowFall.name, _IconArrowFall);
  }
});
export { IconArrowFall as default };
