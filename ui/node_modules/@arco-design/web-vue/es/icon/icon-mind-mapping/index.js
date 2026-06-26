import _IconMindMapping from "./icon-mind-mapping.js";
const IconMindMapping = Object.assign(_IconMindMapping, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconMindMapping.name, _IconMindMapping);
  }
});
export { IconMindMapping as default };
