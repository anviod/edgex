import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Skeleton from "./skeleton.js";
import SkeletonLine from "./line.js";
export { default as SkeletonLine } from "./line.js";
import SkeletonShape from "./shape.js";
export { default as SkeletonShape } from "./shape.js";
const Skeleton = Object.assign(_Skeleton, {
  Line: SkeletonLine,
  Shape: SkeletonShape,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Skeleton.name, _Skeleton);
    app.component(componentPrefix + SkeletonLine.name, SkeletonLine);
    app.component(componentPrefix + SkeletonShape.name, SkeletonShape);
  }
});
export { Skeleton as default };
