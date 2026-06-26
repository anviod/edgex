import _IconFaceFrownFill from "./icon-face-frown-fill.js";
const IconFaceFrownFill = Object.assign(_IconFaceFrownFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFaceFrownFill.name, _IconFaceFrownFill);
  }
});
export { IconFaceFrownFill as default };
