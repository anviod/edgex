import _IconVoice from "./icon-voice.js";
const IconVoice = Object.assign(_IconVoice, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconVoice.name, _IconVoice);
  }
});
export { IconVoice as default };
