import _IconIdcard from "./icon-idcard.js";
const IconIdcard = Object.assign(_IconIdcard, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconIdcard.name, _IconIdcard);
  }
});
export { IconIdcard as default };
