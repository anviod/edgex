import _IconFileAudio from "./icon-file-audio.js";
const IconFileAudio = Object.assign(_IconFileAudio, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFileAudio.name, _IconFileAudio);
  }
});
export { IconFileAudio as default };
