import _IconSound from "./icon-sound.js";
const IconSound = Object.assign(_IconSound, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSound.name, _IconSound);
  }
});
export { IconSound as default };
