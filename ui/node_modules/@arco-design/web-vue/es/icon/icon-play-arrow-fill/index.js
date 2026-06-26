import _IconPlayArrowFill from "./icon-play-arrow-fill.js";
const IconPlayArrowFill = Object.assign(_IconPlayArrowFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconPlayArrowFill.name, _IconPlayArrowFill);
  }
});
export { IconPlayArrowFill as default };
