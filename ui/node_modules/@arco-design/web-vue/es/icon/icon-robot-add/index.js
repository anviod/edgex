import _IconRobotAdd from "./icon-robot-add.js";
const IconRobotAdd = Object.assign(_IconRobotAdd, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconRobotAdd.name, _IconRobotAdd);
  }
});
export { IconRobotAdd as default };
