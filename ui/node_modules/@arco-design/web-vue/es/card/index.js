import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Card from "./card.js";
import CardMeta from "./card-meta.js";
export { default as CardMeta } from "./card-meta.js";
import CardGrid from "./card-grid.js";
export { default as CardGrid } from "./card-grid.js";
const Card = Object.assign(_Card, {
  Meta: CardMeta,
  Grid: CardGrid,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Card.name, _Card);
    app.component(componentPrefix + CardMeta.name, CardMeta);
    app.component(componentPrefix + CardGrid.name, CardGrid);
  }
});
export { Card as default };
