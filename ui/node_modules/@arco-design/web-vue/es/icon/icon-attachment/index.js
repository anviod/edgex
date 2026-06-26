import _IconAttachment from "./icon-attachment.js";
const IconAttachment = Object.assign(_IconAttachment, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconAttachment.name, _IconAttachment);
  }
});
export { IconAttachment as default };
