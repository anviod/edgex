import _IconLink from "./icon-link.js";
const IconLink = Object.assign(_IconLink, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconLink.name, _IconLink);
  }
});
export { IconLink as default };
