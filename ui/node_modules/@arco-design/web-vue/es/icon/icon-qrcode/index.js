import _IconQrcode from "./icon-qrcode.js";
const IconQrcode = Object.assign(_IconQrcode, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconQrcode.name, _IconQrcode);
  }
});
export { IconQrcode as default };
