import _IconMuteFill from "./icon-mute-fill.js";
const IconMuteFill = Object.assign(_IconMuteFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconMuteFill.name, _IconMuteFill);
  }
});
export { IconMuteFill as default };
