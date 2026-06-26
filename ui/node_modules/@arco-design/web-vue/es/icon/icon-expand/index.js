import _IconExpand from "./icon-expand.js";
const IconExpand = Object.assign(_IconExpand, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconExpand.name, _IconExpand);
  }
});
export { IconExpand as default };
