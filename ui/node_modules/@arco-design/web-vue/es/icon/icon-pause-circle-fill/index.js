import _IconPauseCircleFill from "./icon-pause-circle-fill.js";
const IconPauseCircleFill = Object.assign(_IconPauseCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconPauseCircleFill.name, _IconPauseCircleFill);
  }
});
export { IconPauseCircleFill as default };
