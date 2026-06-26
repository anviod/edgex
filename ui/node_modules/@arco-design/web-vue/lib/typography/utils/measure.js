"use strict";
var vue = require("vue");
let ellipsisContainer;
function styleToString(style) {
  const styleNames = Array.prototype.slice.apply(style);
  return styleNames.map((name) => `${name}: ${style.getPropertyValue(name)};`).join("");
}
function pxToNumber(value) {
  if (!value)
    return 0;
  const match = value.match(/^\d*(\.\d*)?/);
  return match ? Number(match[0]) : 0;
}
var measure = (originElement, ellipsisConfig, operations, fullText) => {
  if (!ellipsisContainer) {
    ellipsisContainer = document.createElement("div");
    document.body.appendChild(ellipsisContainer);
  }
  const {
    rows,
    suffix,
    ellipsisStr
  } = ellipsisConfig;
  const originStyle = window.getComputedStyle(originElement);
  const styleString = styleToString(originStyle);
  const lineHeight = pxToNumber(originStyle.lineHeight);
  const maxHeight = Math.round(lineHeight * rows + pxToNumber(originStyle.paddingTop) + pxToNumber(originStyle.paddingBottom));
  ellipsisContainer.setAttribute("style", styleString);
  ellipsisContainer.setAttribute("aria-hidden", "true");
  ellipsisContainer.style.height = "auto";
  ellipsisContainer.style.minHeight = "auto";
  ellipsisContainer.style.maxHeight = "auto";
  ellipsisContainer.style.position = "fixed";
  ellipsisContainer.style.left = "0";
  ellipsisContainer.style.top = "-99999999px";
  ellipsisContainer.style.zIndex = "-200";
  ellipsisContainer.style.whiteSpace = "normal";
  const vm = vue.createApp({
    render() {
      return vue.createVNode("span", null, [operations]);
    }
  });
  vm.mount(ellipsisContainer);
  const operationsChildNodes = Array.prototype.slice.apply(ellipsisContainer.childNodes[0].cloneNode(true).childNodes);
  vm.unmount();
  ellipsisContainer.innerHTML = "";
  const ellipsisTextNode = document.createTextNode(`${ellipsisStr}${suffix}`);
  ellipsisContainer.appendChild(ellipsisTextNode);
  operationsChildNodes.forEach((operationNode) => {
    ellipsisContainer.appendChild(operationNode);
  });
  const textNode = document.createTextNode(fullText);
  ellipsisContainer.insertBefore(textNode, ellipsisTextNode);
  function inRange() {
    return ellipsisContainer.offsetHeight <= maxHeight;
  }
  if (inRange()) {
    return {
      ellipsis: false,
      text: fullText
    };
  }
  function measureText(textNode2, startLoc = 0, endLoc = fullText.length, lastSuccessLoc = 0) {
    const midLoc = Math.floor((startLoc + endLoc) / 2);
    const currentText = fullText.slice(0, midLoc);
    textNode2.textContent = currentText;
    if (startLoc >= endLoc - 1) {
      for (let step = endLoc; step >= startLoc; step -= 1) {
        const currentStepText = fullText.slice(0, step);
        textNode2.textContent = currentStepText;
        if (inRange() || !currentStepText) {
          return;
        }
      }
    }
    if (inRange()) {
      measureText(textNode2, midLoc, endLoc, midLoc);
    } else {
      measureText(textNode2, startLoc, midLoc, lastSuccessLoc);
    }
  }
  measureText(textNode);
  return {
    text: textNode.textContent,
    ellipsis: true
  };
};
module.exports = measure;
