import _IconMessage from "./icon-message.js";
const IconMessage = Object.assign(_IconMessage, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconMessage.name, _IconMessage);
  }
});
export { IconMessage as default };
