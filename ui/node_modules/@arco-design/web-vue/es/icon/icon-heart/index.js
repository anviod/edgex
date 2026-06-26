import _IconHeart from "./icon-heart.js";
const IconHeart = Object.assign(_IconHeart, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconHeart.name, _IconHeart);
  }
});
export { IconHeart as default };
