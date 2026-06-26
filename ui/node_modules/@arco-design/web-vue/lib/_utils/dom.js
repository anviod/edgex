"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var is = require("./is.js");
const NOOP = () => {
  return void 0;
};
const getDocumentSize = () => {
  const { body } = document;
  const html = document.documentElement;
  let topBody;
  try {
    const topWindow = window.top || window.self || window;
    topBody = topWindow.document.body;
  } catch {
  }
  return {
    height: Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
      (topBody == null ? void 0 : topBody.scrollHeight) || 0,
      (topBody == null ? void 0 : topBody.clientHeight) || 0
    ),
    width: Math.max(
      body.scrollWidth,
      body.offsetWidth,
      html.clientWidth,
      html.scrollWidth,
      html.offsetWidth,
      (topBody == null ? void 0 : topBody.scrollWidth) || 0,
      (topBody == null ? void 0 : topBody.clientWidth) || 0
    )
  };
};
const isServerRendering = (() => {
  try {
    return !(typeof window !== "undefined" && document !== void 0);
  } catch (e) {
    return true;
  }
})();
const on = (() => {
  if (isServerRendering) {
    return NOOP;
  }
  return (element, event, handler, options = false) => {
    element.addEventListener(
      event,
      handler,
      options
    );
  };
})();
const off = (() => {
  if (isServerRendering) {
    return NOOP;
  }
  return (element, type, handler, options = false) => {
    element.removeEventListener(
      type,
      handler,
      options
    );
  };
})();
const contains = (root, ele) => {
  if (!root || !ele) {
    return false;
  }
  let node = ele;
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};
const getOverlay = (type) => {
  const popper = document.createElement("div");
  popper.setAttribute("class", `arco-overlay arco-overlay-${type}`);
  return popper;
};
const querySelector = (selectors, container) => {
  var _a;
  if (isServerRendering) {
    return NOOP();
  }
  return (_a = (container != null ? container : document).querySelector(selectors)) != null ? _a : void 0;
};
const getElement = (target, container) => {
  if (is.isString(target)) {
    const selector = target[0] === "#" ? `[id='${target.slice(1)}']` : target;
    return querySelector(selector, container);
  }
  return target;
};
const getRelativeRect = (target, relative) => {
  const targetRect = target.getBoundingClientRect();
  const relativeRect = relative.getBoundingClientRect();
  return {
    top: targetRect.top - relativeRect.top,
    bottom: relativeRect.bottom - targetRect.bottom,
    left: targetRect.left - relativeRect.left,
    right: relativeRect.right - targetRect.right,
    width: targetRect.width,
    height: targetRect.height
  };
};
const isScroll = (element) => {
  return element.tagName === "BODY" ? document.documentElement.scrollHeight > window.innerHeight : element.scrollHeight > element.offsetHeight;
};
const getScrollBarWidth = (element) => {
  return element.tagName === "BODY" ? window.innerWidth - getDocumentSize().width : element.offsetWidth - element.clientWidth;
};
exports.NOOP = NOOP;
exports.contains = contains;
exports.getDocumentSize = getDocumentSize;
exports.getElement = getElement;
exports.getOverlay = getOverlay;
exports.getRelativeRect = getRelativeRect;
exports.getScrollBarWidth = getScrollBarWidth;
exports.isScroll = isScroll;
exports.isServerRendering = isServerRendering;
exports.off = off;
exports.on = on;
exports.querySelector = querySelector;
