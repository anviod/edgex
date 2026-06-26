import _IconRobot from "./icon-robot.js";
const IconRobot = Object.assign(_IconRobot, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconRobot.name, _IconRobot);
  }
});
export { IconRobot as default };
