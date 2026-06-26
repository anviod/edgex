import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Comment from "./comment.js";
const Comment = Object.assign(_Comment, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Comment.name, _Comment);
  }
});
export { Comment as default };
