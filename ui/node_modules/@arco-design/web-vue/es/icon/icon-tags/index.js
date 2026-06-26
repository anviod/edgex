import _IconTags from "./icon-tags.js";
const IconTags = Object.assign(_IconTags, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconTags.name, _IconTags);
  }
});
export { IconTags as default };
