import _IconQuestionCircleFill from "./icon-question-circle-fill.js";
const IconQuestionCircleFill = Object.assign(_IconQuestionCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconQuestionCircleFill.name, _IconQuestionCircleFill);
  }
});
export { IconQuestionCircleFill as default };
