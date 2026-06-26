import _IconRotateRight from "./icon-rotate-right.js";
const IconRotateRight = Object.assign(_IconRotateRight, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconRotateRight.name, _IconRotateRight);
  }
});
export { IconRotateRight as default };
