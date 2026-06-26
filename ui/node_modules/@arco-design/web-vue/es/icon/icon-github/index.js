import _IconGithub from "./icon-github.js";
const IconGithub = Object.assign(_IconGithub, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconGithub.name, _IconGithub);
  }
});
export { IconGithub as default };
