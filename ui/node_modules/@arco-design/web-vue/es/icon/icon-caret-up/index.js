import _IconCaretUp from "./icon-caret-up.js";
const IconCaretUp = Object.assign(_IconCaretUp, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCaretUp.name, _IconCaretUp);
  }
});
export { IconCaretUp as default };
