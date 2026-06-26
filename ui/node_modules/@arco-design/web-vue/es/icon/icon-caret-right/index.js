import _IconCaretRight from "./icon-caret-right.js";
const IconCaretRight = Object.assign(_IconCaretRight, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCaretRight.name, _IconCaretRight);
  }
});
export { IconCaretRight as default };
