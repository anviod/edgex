"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var card = require("./card.js");
var cardMeta = require("./card-meta.js");
var cardGrid = require("./card-grid.js");
const Card = Object.assign(card, {
  Meta: cardMeta,
  Grid: cardGrid,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + card.name, card);
    app.component(componentPrefix + cardMeta.name, cardMeta);
    app.component(componentPrefix + cardGrid.name, cardGrid);
  }
});
exports.CardMeta = cardMeta;
exports.CardGrid = cardGrid;
exports["default"] = Card;
