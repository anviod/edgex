import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Avatar from "./avatar.js";
import AvatarGroup from "./avatar-group.js";
export { default as AvatarGroup } from "./avatar-group.js";
const Avatar = Object.assign(_Avatar, {
  Group: AvatarGroup,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Avatar.name, _Avatar);
    app.component(componentPrefix + AvatarGroup.name, AvatarGroup);
  }
});
export { Avatar as default };
