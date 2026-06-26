import _IconArrowLeft from "./icon-arrow-left.js";
const IconArrowLeft = Object.assign(_IconArrowLeft, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconArrowLeft.name, _IconArrowLeft);
  }
});
export { IconArrowLeft as default };
