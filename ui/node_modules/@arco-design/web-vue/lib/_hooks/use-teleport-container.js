"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var dom = require("../_utils/dom.js");
const useTeleportContainer = ({
  popupContainer,
  visible,
  defaultContainer = "body",
  documentContainer
}) => {
  const teleportContainer = vue.ref(popupContainer.value);
  const containerRef = vue.ref();
  const getContainer = () => {
    const element = dom.getElement(popupContainer.value);
    const _teleportContainer = element ? popupContainer.value : defaultContainer;
    const _containerElement = element != null ? element : documentContainer ? document.documentElement : dom.getElement(defaultContainer);
    if (_teleportContainer !== teleportContainer.value) {
      teleportContainer.value = _teleportContainer;
    }
    if (_containerElement !== containerRef.value) {
      containerRef.value = _containerElement;
    }
  };
  vue.onMounted(() => getContainer());
  vue.watch(visible, (visible2) => {
    if (teleportContainer.value !== popupContainer.value && visible2) {
      getContainer();
    }
  });
  return {
    teleportContainer,
    containerRef
  };
};
exports.useTeleportContainer = useTeleportContainer;
