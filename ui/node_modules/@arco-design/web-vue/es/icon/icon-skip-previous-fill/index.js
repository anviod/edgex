import _IconSkipPreviousFill from "./icon-skip-previous-fill.js";
const IconSkipPreviousFill = Object.assign(_IconSkipPreviousFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSkipPreviousFill.name, _IconSkipPreviousFill);
  }
});
export { IconSkipPreviousFill as default };
