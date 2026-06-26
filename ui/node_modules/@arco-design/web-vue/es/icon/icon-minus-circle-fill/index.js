import _IconMinusCircleFill from "./icon-minus-circle-fill.js";
const IconMinusCircleFill = Object.assign(_IconMinusCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconMinusCircleFill.name, _IconMinusCircleFill);
  }
});
export { IconMinusCircleFill as default };
