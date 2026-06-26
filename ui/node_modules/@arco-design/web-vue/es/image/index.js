import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Image from "./image.js";
import ImagePreview from "./preview.js";
export { default as ImagePreview } from "./preview.js";
import ImagePreviewGroup from "./preview-group.js";
export { default as ImagePreviewGroup } from "./preview-group.js";
import ImagePreviewAction from "./preview-action.js";
export { default as ImagePreviewAction } from "./preview-action.js";
const Image = Object.assign(_Image, {
  Preview: ImagePreview,
  PreviewGroup: ImagePreviewGroup,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Image.name, _Image);
    app.component(componentPrefix + ImagePreview.name, ImagePreview);
    app.component(
      componentPrefix + ImagePreviewGroup.name,
      ImagePreviewGroup
    );
    app.component(
      componentPrefix + ImagePreviewAction.name,
      ImagePreviewAction
    );
  }
});
export { Image as default };
