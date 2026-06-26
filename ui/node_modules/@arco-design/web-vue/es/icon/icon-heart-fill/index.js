import _IconHeartFill from "./icon-heart-fill.js";
const IconHeartFill = Object.assign(_IconHeartFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconHeartFill.name, _IconHeartFill);
  }
});
export { IconHeartFill as default };
