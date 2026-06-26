import _IconPlusCircle from "./icon-plus-circle.js";
const IconPlusCircle = Object.assign(_IconPlusCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconPlusCircle.name, _IconPlusCircle);
  }
});
export { IconPlusCircle as default };
