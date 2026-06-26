import _IconShake from "./icon-shake.js";
const IconShake = Object.assign(_IconShake, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconShake.name, _IconShake);
  }
});
export { IconShake as default };
