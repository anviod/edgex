import _IconMessageBanned from "./icon-message-banned.js";
const IconMessageBanned = Object.assign(_IconMessageBanned, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconMessageBanned.name, _IconMessageBanned);
  }
});
export { IconMessageBanned as default };
