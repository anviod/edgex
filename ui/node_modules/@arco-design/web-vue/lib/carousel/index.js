"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var carousel = require("./carousel.js");
var carouselItem = require("./carousel-item.js");
const Carousel = Object.assign(carousel, {
  Item: carouselItem,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + carousel.name, carousel);
    app.component(componentPrefix + carouselItem.name, carouselItem);
  }
});
exports.CarouselItem = carouselItem;
exports["default"] = Carousel;
