import _IconReply from "./icon-reply.js";
const IconReply = Object.assign(_IconReply, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconReply.name, _IconReply);
  }
});
export { IconReply as default };
