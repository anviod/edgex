import _IconArrowRight from "./icon-arrow-right.js";
const IconArrowRight = Object.assign(_IconArrowRight, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconArrowRight.name, _IconArrowRight);
  }
});
export { IconArrowRight as default };
