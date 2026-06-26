import _IconCaretDown from "./icon-caret-down.js";
const IconCaretDown = Object.assign(_IconCaretDown, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCaretDown.name, _IconCaretDown);
  }
});
export { IconCaretDown as default };
