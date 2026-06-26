import _IconCalendar from "./icon-calendar.js";
const IconCalendar = Object.assign(_IconCalendar, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCalendar.name, _IconCalendar);
  }
});
export { IconCalendar as default };
