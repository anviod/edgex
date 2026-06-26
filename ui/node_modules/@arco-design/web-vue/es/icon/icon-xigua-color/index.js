import _IconXiguaColor from "./icon-xigua-color.js";
const IconXiguaColor = Object.assign(_IconXiguaColor, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconXiguaColor.name, _IconXiguaColor);
  }
});
export { IconXiguaColor as default };
