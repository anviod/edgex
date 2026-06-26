import _IconMusic from "./icon-music.js";
const IconMusic = Object.assign(_IconMusic, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconMusic.name, _IconMusic);
  }
});
export { IconMusic as default };
