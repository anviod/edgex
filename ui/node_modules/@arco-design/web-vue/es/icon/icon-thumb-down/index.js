import _IconThumbDown from "./icon-thumb-down.js";
const IconThumbDown = Object.assign(_IconThumbDown, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconThumbDown.name, _IconThumbDown);
  }
});
export { IconThumbDown as default };
