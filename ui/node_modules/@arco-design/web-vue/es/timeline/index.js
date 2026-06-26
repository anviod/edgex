import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Timeline from "./timeline.js";
import TimelineItem from "./item.js";
export { default as TimelineItem } from "./item.js";
const Timeline = Object.assign(_Timeline, {
  Item: TimelineItem,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Timeline.name, _Timeline);
    app.component(componentPrefix + TimelineItem.name, TimelineItem);
  }
});
export { Timeline as default };
