import _IconPlayArrow from "./icon-play-arrow.js";
const IconPlayArrow = Object.assign(_IconPlayArrow, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconPlayArrow.name, _IconPlayArrow);
  }
});
export { IconPlayArrow as default };
