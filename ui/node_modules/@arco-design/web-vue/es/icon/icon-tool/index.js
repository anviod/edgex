import _IconTool from "./icon-tool.js";
const IconTool = Object.assign(_IconTool, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconTool.name, _IconTool);
  }
});
export { IconTool as default };
