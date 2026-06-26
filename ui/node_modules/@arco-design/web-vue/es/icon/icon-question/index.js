import _IconQuestion from "./icon-question.js";
const IconQuestion = Object.assign(_IconQuestion, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconQuestion.name, _IconQuestion);
  }
});
export { IconQuestion as default };
