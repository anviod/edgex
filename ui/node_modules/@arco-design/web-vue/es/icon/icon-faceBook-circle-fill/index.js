import _IconFaceBookCircleFill from "./icon-faceBook-circle-fill.js";
const IconFaceBookCircleFill = Object.assign(_IconFaceBookCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFaceBookCircleFill.name, _IconFaceBookCircleFill);
  }
});
export { IconFaceBookCircleFill as default };
