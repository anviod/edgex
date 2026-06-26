import _IconPlusCircleFill from "./icon-plus-circle-fill.js";
const IconPlusCircleFill = Object.assign(_IconPlusCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconPlusCircleFill.name, _IconPlusCircleFill);
  }
});
export { IconPlusCircleFill as default };
