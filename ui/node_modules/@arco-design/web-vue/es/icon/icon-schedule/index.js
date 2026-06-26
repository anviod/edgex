import _IconSchedule from "./icon-schedule.js";
const IconSchedule = Object.assign(_IconSchedule, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSchedule.name, _IconSchedule);
  }
});
export { IconSchedule as default };
