import _IconLaunch from "./icon-launch.js";
const IconLaunch = Object.assign(_IconLaunch, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconLaunch.name, _IconLaunch);
  }
});
export { IconLaunch as default };
