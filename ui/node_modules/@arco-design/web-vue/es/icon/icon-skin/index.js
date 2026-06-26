import _IconSkin from "./icon-skin.js";
const IconSkin = Object.assign(_IconSkin, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSkin.name, _IconSkin);
  }
});
export { IconSkin as default };
