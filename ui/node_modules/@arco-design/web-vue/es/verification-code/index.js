import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _VerificationCode from "./verification-code.js";
const VerificationCode = Object.assign(_VerificationCode, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _VerificationCode.name, _VerificationCode);
  }
});
export { VerificationCode as default };
