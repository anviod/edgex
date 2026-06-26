import _IconSend from "./icon-send.js";
const IconSend = Object.assign(_IconSend, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSend.name, _IconSend);
  }
});
export { IconSend as default };
