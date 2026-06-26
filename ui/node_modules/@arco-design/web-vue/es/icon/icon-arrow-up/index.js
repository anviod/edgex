import _IconArrowUp from "./icon-arrow-up.js";
const IconArrowUp = Object.assign(_IconArrowUp, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconArrowUp.name, _IconArrowUp);
  }
});
export { IconArrowUp as default };
