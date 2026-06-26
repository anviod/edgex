import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Tree from "./tree.js";
const Tree = Object.assign(_Tree, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Tree.name, _Tree);
  }
});
export { Tree as default };
