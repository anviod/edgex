import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Statistic from "./statistic.js";
import Countdown from "./countdown.js";
export { default as Countdown } from "./countdown.js";
const Statistic = Object.assign(_Statistic, {
  Countdown,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Statistic.name, _Statistic);
    app.component(componentPrefix + Countdown.name, Countdown);
  }
});
export { Statistic as default };
