import _IconCaretLeft from "./icon-caret-left.js";
const IconCaretLeft = Object.assign(_IconCaretLeft, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCaretLeft.name, _IconCaretLeft);
  }
});
export { IconCaretLeft as default };
