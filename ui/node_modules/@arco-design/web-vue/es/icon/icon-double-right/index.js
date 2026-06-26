import _IconDoubleRight from "./icon-double-right.js";
const IconDoubleRight = Object.assign(_IconDoubleRight, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconDoubleRight.name, _IconDoubleRight);
  }
});
export { IconDoubleRight as default };
