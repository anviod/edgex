import _IconToBottom from "./icon-to-bottom.js";
const IconToBottom = Object.assign(_IconToBottom, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconToBottom.name, _IconToBottom);
  }
});
export { IconToBottom as default };
