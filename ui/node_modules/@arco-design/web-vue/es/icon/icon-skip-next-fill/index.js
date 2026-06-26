import _IconSkipNextFill from "./icon-skip-next-fill.js";
const IconSkipNextFill = Object.assign(_IconSkipNextFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSkipNextFill.name, _IconSkipNextFill);
  }
});
export { IconSkipNextFill as default };
