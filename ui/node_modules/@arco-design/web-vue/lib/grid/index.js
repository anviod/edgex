"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var gridRow = require("./grid-row.js");
var gridCol = require("./grid-col.js");
var grid = require("./grid.js");
var gridItem = require("./grid-item.js");
const Grid = Object.assign(grid, {
  Row: gridRow,
  Col: gridCol,
  Item: gridItem,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + gridRow.name, gridRow);
    app.component(componentPrefix + gridCol.name, gridCol);
    app.component(componentPrefix + grid.name, grid);
    app.component(componentPrefix + gridItem.name, gridItem);
  }
});
exports.Row = gridRow;
exports.Col = gridCol;
exports.GridItem = gridItem;
exports["default"] = Grid;
