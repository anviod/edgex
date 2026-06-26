import _IconInteraction from "./icon-interaction.js";
const IconInteraction = Object.assign(_IconInteraction, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconInteraction.name, _IconInteraction);
  }
});
export { IconInteraction as default };
