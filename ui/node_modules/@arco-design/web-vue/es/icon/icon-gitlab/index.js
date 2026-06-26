import _IconGitlab from "./icon-gitlab.js";
const IconGitlab = Object.assign(_IconGitlab, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconGitlab.name, _IconGitlab);
  }
});
export { IconGitlab as default };
