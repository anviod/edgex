import _IconAlignRight from "./icon-align-right.js";
const IconAlignRight = Object.assign(_IconAlignRight, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconAlignRight.name, _IconAlignRight);
  }
});
export { IconAlignRight as default };
