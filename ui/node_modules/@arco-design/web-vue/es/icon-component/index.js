import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Icon from "./icon.js";
import { addFromIconFontCn } from "./add-from-icon-font-cn.js";
const Icon = Object.assign(_Icon, {
  addFromIconFontCn,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Icon.name, _Icon);
  }
});
export { Icon as default };
