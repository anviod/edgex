import _IconRight from "./icon-right.js";
const IconRight = Object.assign(_IconRight, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconRight.name, _IconRight);
  }
});
export { IconRight as default };
