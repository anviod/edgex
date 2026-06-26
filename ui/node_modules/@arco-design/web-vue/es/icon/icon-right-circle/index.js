import _IconRightCircle from "./icon-right-circle.js";
const IconRightCircle = Object.assign(_IconRightCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconRightCircle.name, _IconRightCircle);
  }
});
export { IconRightCircle as default };
