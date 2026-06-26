import _IconArrowDown from "./icon-arrow-down.js";
const IconArrowDown = Object.assign(_IconArrowDown, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconArrowDown.name, _IconArrowDown);
  }
});
export { IconArrowDown as default };
