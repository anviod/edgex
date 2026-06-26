import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Steps from "./steps.js";
import Step from "./step.js";
export { default as Step } from "./step.js";
const Steps = Object.assign(_Steps, {
  Step,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Steps.name, _Steps);
    app.component(componentPrefix + Step.name, Step);
  }
});
export { Steps as default };
