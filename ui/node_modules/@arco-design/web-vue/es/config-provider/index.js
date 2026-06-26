import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _ConfigProvider from "./config-provider.js";
const ConfigProvider = Object.assign(_ConfigProvider, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _ConfigProvider.name, _ConfigProvider);
  }
});
export { ConfigProvider as default };
