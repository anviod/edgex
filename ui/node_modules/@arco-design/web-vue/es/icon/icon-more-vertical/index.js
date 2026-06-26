import _IconMoreVertical from "./icon-more-vertical.js";
const IconMoreVertical = Object.assign(_IconMoreVertical, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconMoreVertical.name, _IconMoreVertical);
  }
});
export { IconMoreVertical as default };
