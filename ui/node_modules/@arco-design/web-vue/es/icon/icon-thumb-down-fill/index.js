import _IconThumbDownFill from "./icon-thumb-down-fill.js";
const IconThumbDownFill = Object.assign(_IconThumbDownFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconThumbDownFill.name, _IconThumbDownFill);
  }
});
export { IconThumbDownFill as default };
