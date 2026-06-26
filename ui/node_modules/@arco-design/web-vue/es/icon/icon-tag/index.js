import _IconTag from "./icon-tag.js";
const IconTag = Object.assign(_IconTag, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconTag.name, _IconTag);
  }
});
export { IconTag as default };
