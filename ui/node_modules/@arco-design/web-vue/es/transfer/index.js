import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Transfer from "./transfer.js";
const Transfer = Object.assign(_Transfer, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Transfer.name, _Transfer);
  }
});
export { Transfer as default };
