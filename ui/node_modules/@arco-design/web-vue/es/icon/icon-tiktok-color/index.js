import _IconTiktokColor from "./icon-tiktok-color.js";
const IconTiktokColor = Object.assign(_IconTiktokColor, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconTiktokColor.name, _IconTiktokColor);
  }
});
export { IconTiktokColor as default };
