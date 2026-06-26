import _IconFaceSmileFill from "./icon-face-smile-fill.js";
const IconFaceSmileFill = Object.assign(_IconFaceSmileFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFaceSmileFill.name, _IconFaceSmileFill);
  }
});
export { IconFaceSmileFill as default };
