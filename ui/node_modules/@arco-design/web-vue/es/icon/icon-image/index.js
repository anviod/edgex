import _IconImage from "./icon-image.js";
const IconImage = Object.assign(_IconImage, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconImage.name, _IconImage);
  }
});
export { IconImage as default };
