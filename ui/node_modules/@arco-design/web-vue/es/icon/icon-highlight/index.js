import _IconHighlight from "./icon-highlight.js";
const IconHighlight = Object.assign(_IconHighlight, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconHighlight.name, _IconHighlight);
  }
});
export { IconHighlight as default };
