import _IconUpCircle from "./icon-up-circle.js";
const IconUpCircle = Object.assign(_IconUpCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconUpCircle.name, _IconUpCircle);
  }
});
export { IconUpCircle as default };
