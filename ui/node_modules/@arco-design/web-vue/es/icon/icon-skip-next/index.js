import _IconSkipNext from "./icon-skip-next.js";
const IconSkipNext = Object.assign(_IconSkipNext, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSkipNext.name, _IconSkipNext);
  }
});
export { IconSkipNext as default };
