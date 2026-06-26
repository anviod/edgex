import _IconUpload from "./icon-upload.js";
const IconUpload = Object.assign(_IconUpload, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconUpload.name, _IconUpload);
  }
});
export { IconUpload as default };
