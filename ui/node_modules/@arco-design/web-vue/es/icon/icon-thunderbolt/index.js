import _IconThunderbolt from "./icon-thunderbolt.js";
const IconThunderbolt = Object.assign(_IconThunderbolt, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconThunderbolt.name, _IconThunderbolt);
  }
});
export { IconThunderbolt as default };
