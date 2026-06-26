import _IconMinusCircle from "./icon-minus-circle.js";
const IconMinusCircle = Object.assign(_IconMinusCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconMinusCircle.name, _IconMinusCircle);
  }
});
export { IconMinusCircle as default };
