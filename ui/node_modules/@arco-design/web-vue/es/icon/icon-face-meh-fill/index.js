import _IconFaceMehFill from "./icon-face-meh-fill.js";
const IconFaceMehFill = Object.assign(_IconFaceMehFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFaceMehFill.name, _IconFaceMehFill);
  }
});
export { IconFaceMehFill as default };
