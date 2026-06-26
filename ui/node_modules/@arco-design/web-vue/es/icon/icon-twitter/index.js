import _IconTwitter from "./icon-twitter.js";
const IconTwitter = Object.assign(_IconTwitter, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconTwitter.name, _IconTwitter);
  }
});
export { IconTwitter as default };
