import _IconExperiment from "./icon-experiment.js";
const IconExperiment = Object.assign(_IconExperiment, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconExperiment.name, _IconExperiment);
  }
});
export { IconExperiment as default };
