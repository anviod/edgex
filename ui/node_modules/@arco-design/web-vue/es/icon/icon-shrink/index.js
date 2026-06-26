import _IconShrink from "./icon-shrink.js";
const IconShrink = Object.assign(_IconShrink, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconShrink.name, _IconShrink);
  }
});
export { IconShrink as default };
