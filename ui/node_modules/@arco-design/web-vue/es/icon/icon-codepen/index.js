import _IconCodepen from "./icon-codepen.js";
const IconCodepen = Object.assign(_IconCodepen, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCodepen.name, _IconCodepen);
  }
});
export { IconCodepen as default };
