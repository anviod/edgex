import _IconTwitterCircleFill from "./icon-twitter-circle-fill.js";
const IconTwitterCircleFill = Object.assign(_IconTwitterCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconTwitterCircleFill.name, _IconTwitterCircleFill);
  }
});
export { IconTwitterCircleFill as default };
