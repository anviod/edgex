import _IconQuestionCircle from "./icon-question-circle.js";
const IconQuestionCircle = Object.assign(_IconQuestionCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconQuestionCircle.name, _IconQuestionCircle);
  }
});
export { IconQuestionCircle as default };
