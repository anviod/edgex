import _IconStrikethrough from "./icon-strikethrough.js";
const IconStrikethrough = Object.assign(_IconStrikethrough, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconStrikethrough.name, _IconStrikethrough);
  }
});
export { IconStrikethrough as default };
