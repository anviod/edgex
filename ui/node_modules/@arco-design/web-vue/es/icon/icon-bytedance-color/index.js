import _IconBytedanceColor from "./icon-bytedance-color.js";
const IconBytedanceColor = Object.assign(_IconBytedanceColor, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconBytedanceColor.name, _IconBytedanceColor);
  }
});
export { IconBytedanceColor as default };
