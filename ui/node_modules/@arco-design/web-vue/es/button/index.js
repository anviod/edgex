import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Button from "./button.js";
import ButtonGroup from "./button-group.js";
export { default as ButtonGroup } from "./button-group.js";
const Button = Object.assign(_Button, {
  Group: ButtonGroup,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Button.name, _Button);
    app.component(componentPrefix + ButtonGroup.name, ButtonGroup);
  }
});
export { Button as default };
