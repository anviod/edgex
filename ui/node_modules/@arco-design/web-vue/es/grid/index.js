import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import Row from "./grid-row.js";
export { default as Row } from "./grid-row.js";
import Col from "./grid-col.js";
export { default as Col } from "./grid-col.js";
import _Grid from "./grid.js";
import GridItem from "./grid-item.js";
export { default as GridItem } from "./grid-item.js";
const Grid = Object.assign(_Grid, {
  Row,
  Col,
  Item: GridItem,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + Row.name, Row);
    app.component(componentPrefix + Col.name, Col);
    app.component(componentPrefix + _Grid.name, _Grid);
    app.component(componentPrefix + GridItem.name, GridItem);
  }
});
export { Grid as default };
