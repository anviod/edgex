import _IconCalendarClock from "./icon-calendar-clock.js";
const IconCalendarClock = Object.assign(_IconCalendarClock, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCalendarClock.name, _IconCalendarClock);
  }
});
export { IconCalendarClock as default };
