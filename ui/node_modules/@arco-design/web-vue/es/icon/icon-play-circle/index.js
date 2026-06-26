import _IconPlayCircle from "./icon-play-circle.js";
const IconPlayCircle = Object.assign(_IconPlayCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconPlayCircle.name, _IconPlayCircle);
  }
});
export { IconPlayCircle as default };
