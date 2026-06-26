import _IconSkipPrevious from "./icon-skip-previous.js";
const IconSkipPrevious = Object.assign(_IconSkipPrevious, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSkipPrevious.name, _IconSkipPrevious);
  }
});
export { IconSkipPrevious as default };
