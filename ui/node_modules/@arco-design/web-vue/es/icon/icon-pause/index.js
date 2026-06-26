import _IconPause from "./icon-pause.js";
const IconPause = Object.assign(_IconPause, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconPause.name, _IconPause);
  }
});
export { IconPause as default };
