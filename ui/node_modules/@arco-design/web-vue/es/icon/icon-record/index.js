import _IconRecord from "./icon-record.js";
const IconRecord = Object.assign(_IconRecord, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconRecord.name, _IconRecord);
  }
});
export { IconRecord as default };
