import _IconThumbUpFill from "./icon-thumb-up-fill.js";
const IconThumbUpFill = Object.assign(_IconThumbUpFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconThumbUpFill.name, _IconThumbUpFill);
  }
});
export { IconThumbUpFill as default };
