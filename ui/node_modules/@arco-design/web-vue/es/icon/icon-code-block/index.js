import _IconCodeBlock from "./icon-code-block.js";
const IconCodeBlock = Object.assign(_IconCodeBlock, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCodeBlock.name, _IconCodeBlock);
  }
});
export { IconCodeBlock as default };
