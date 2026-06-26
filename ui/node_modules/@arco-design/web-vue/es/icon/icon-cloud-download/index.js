import _IconCloudDownload from "./icon-cloud-download.js";
const IconCloudDownload = Object.assign(_IconCloudDownload, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCloudDownload.name, _IconCloudDownload);
  }
});
export { IconCloudDownload as default };
