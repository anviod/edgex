import _IconThumbUp from "./icon-thumb-up.js";
const IconThumbUp = Object.assign(_IconThumbUp, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconThumbUp.name, _IconThumbUp);
  }
});
export { IconThumbUp as default };
