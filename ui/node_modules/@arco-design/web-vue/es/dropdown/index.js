import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Dropdown from "./dropdown.js";
import Doption from "./dropdown-option.js";
export { default as Doption } from "./dropdown-option.js";
import Dgroup from "./dropdown-group.js";
export { default as Dgroup } from "./dropdown-group.js";
import Dsubmenu from "./dropdown-submenu.js";
export { default as Dsubmenu } from "./dropdown-submenu.js";
import DropdownButton from "./dropdown-button.js";
export { default as DropdownButton } from "./dropdown-button.js";
const Dropdown = Object.assign(_Dropdown, {
  Option: Doption,
  Group: Dgroup,
  Submenu: Dsubmenu,
  Button: DropdownButton,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Dropdown.name, _Dropdown);
    app.component(componentPrefix + Doption.name, Doption);
    app.component(componentPrefix + Dgroup.name, Dgroup);
    app.component(componentPrefix + Dsubmenu.name, Dsubmenu);
    app.component(componentPrefix + DropdownButton.name, DropdownButton);
  }
});
export { Dropdown as default };
