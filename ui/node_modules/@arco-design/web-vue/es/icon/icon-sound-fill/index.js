import _IconSoundFill from "./icon-sound-fill.js";
const IconSoundFill = Object.assign(_IconSoundFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSoundFill.name, _IconSoundFill);
  }
});
export { IconSoundFill as default };
