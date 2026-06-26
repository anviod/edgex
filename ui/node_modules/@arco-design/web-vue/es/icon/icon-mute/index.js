import _IconMute from "./icon-mute.js";
const IconMute = Object.assign(_IconMute, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconMute.name, _IconMute);
  }
});
export { IconMute as default };
