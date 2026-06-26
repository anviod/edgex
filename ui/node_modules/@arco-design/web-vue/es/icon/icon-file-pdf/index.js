import _IconFilePdf from "./icon-file-pdf.js";
const IconFilePdf = Object.assign(_IconFilePdf, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFilePdf.name, _IconFilePdf);
  }
});
export { IconFilePdf as default };
