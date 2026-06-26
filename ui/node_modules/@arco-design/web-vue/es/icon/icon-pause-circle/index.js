import _IconPauseCircle from "./icon-pause-circle.js";
const IconPauseCircle = Object.assign(_IconPauseCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconPauseCircle.name, _IconPauseCircle);
  }
});
export { IconPauseCircle as default };
