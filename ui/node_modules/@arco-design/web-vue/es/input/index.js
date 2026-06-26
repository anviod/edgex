import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Input from "./input.js";
import InputSearch from "./input-search.js";
export { default as InputSearch } from "./input-search.js";
import InputPassword from "./input-password.js";
export { default as InputPassword } from "./input-password.js";
import InputGroup from "./input-group.js";
export { default as InputGroup } from "./input-group.js";
const Input = Object.assign(_Input, {
  Search: InputSearch,
  Password: InputPassword,
  Group: InputGroup,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Input.name, _Input);
    app.component(componentPrefix + InputGroup.name, InputGroup);
    app.component(componentPrefix + InputSearch.name, InputSearch);
    app.component(componentPrefix + InputPassword.name, InputPassword);
  }
});
export { Input as default };
