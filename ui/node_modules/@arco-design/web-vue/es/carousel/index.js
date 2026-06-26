import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Carousel from "./carousel.js";
import CarouselItem from "./carousel-item.js";
export { default as CarouselItem } from "./carousel-item.js";
const Carousel = Object.assign(_Carousel, {
  Item: CarouselItem,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Carousel.name, _Carousel);
    app.component(componentPrefix + CarouselItem.name, CarouselItem);
  }
});
export { Carousel as default };
