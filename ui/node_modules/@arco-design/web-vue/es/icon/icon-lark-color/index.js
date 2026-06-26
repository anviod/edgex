import _IconLarkColor from "./icon-lark-color.js";
const IconLarkColor = Object.assign(_IconLarkColor, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconLarkColor.name, _IconLarkColor);
  }
});
export { IconLarkColor as default };
