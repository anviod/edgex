import _IconCloud from "./icon-cloud.js";
const IconCloud = Object.assign(_IconCloud, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCloud.name, _IconCloud);
  }
});
export { IconCloud as default };
