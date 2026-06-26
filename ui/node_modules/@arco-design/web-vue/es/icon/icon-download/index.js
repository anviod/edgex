import _IconDownload from "./icon-download.js";
const IconDownload = Object.assign(_IconDownload, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconDownload.name, _IconDownload);
  }
});
export { IconDownload as default };
