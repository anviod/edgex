import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Calendar from "./calendar.js";
const Calendar = Object.assign(_Calendar, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Calendar.name, _Calendar);
  }
});
export { Calendar as default };
