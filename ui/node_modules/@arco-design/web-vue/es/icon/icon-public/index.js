import _IconPublic from "./icon-public.js";
const IconPublic = Object.assign(_IconPublic, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconPublic.name, _IconPublic);
  }
});
export { IconPublic as default };
