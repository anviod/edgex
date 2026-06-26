import _IconFileImage from "./icon-file-image.js";
const IconFileImage = Object.assign(_IconFileImage, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFileImage.name, _IconFileImage);
  }
});
export { IconFileImage as default };
