import _IconPlayCircleFill from "./icon-play-circle-fill.js";
const IconPlayCircleFill = Object.assign(_IconPlayCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconPlayCircleFill.name, _IconPlayCircleFill);
  }
});
export { IconPlayCircleFill as default };
