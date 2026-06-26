"use strict";
var vue = require("vue");
var dom = require("../_utils/dom.js");
var is = require("../_utils/is.js");
function usePopupContainer(defaultPopupContainer, props) {
  const { popupContainer } = vue.toRefs(props);
  const container = vue.computed(
    () => (is.isString(popupContainer.value) ? dom.querySelector(popupContainer.value) : popupContainer.value) || defaultPopupContainer
  );
  return container;
}
module.exports = usePopupContainer;
