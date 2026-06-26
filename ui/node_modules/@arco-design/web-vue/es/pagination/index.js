import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Pagination from "./pagination.js";
const Pagination = Object.assign(_Pagination, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Pagination.name, _Pagination);
  }
});
export { Pagination as default };
