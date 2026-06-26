import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Typography from "./typography.js";
import TypographyParagraph from "./paragraph.js";
export { default as TypographyParagraph } from "./paragraph.js";
import TypographyTitle from "./title.js";
export { default as TypographyTitle } from "./title.js";
import TypographyText from "./text.js";
export { default as TypographyText } from "./text.js";
const Typography = Object.assign(_Typography, {
  Paragraph: TypographyParagraph,
  Title: TypographyTitle,
  Text: TypographyText,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Typography.name, _Typography);
    app.component(
      componentPrefix + TypographyParagraph.name,
      TypographyParagraph
    );
    app.component(componentPrefix + TypographyTitle.name, TypographyTitle);
    app.component(componentPrefix + TypographyText.name, TypographyText);
  }
});
export { Typography as default };
