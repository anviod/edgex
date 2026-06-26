import _IconStamp from "./icon-stamp.js";
const IconStamp = Object.assign(_IconStamp, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconStamp.name, _IconStamp);
  }
});
export { IconStamp as default };
