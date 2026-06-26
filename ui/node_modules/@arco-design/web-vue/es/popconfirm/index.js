import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Popconfirm from "./popconfirm.js";
const Popconfirm = Object.assign(_Popconfirm, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Popconfirm.name, _Popconfirm);
  }
});
export { Popconfirm as default };
