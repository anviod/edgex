"use strict";
function getFixTranslate(wrapperRect, imgRect, translateX, translateY, scale) {
  let fixTranslateX = translateX;
  let fixTranslateY = translateY;
  if (translateX) {
    if (wrapperRect.width > imgRect.width) {
      fixTranslateX = 0;
    } else {
      if (imgRect.left > wrapperRect.left) {
        fixTranslateX -= Math.abs(wrapperRect.left - imgRect.left) / scale;
      }
      if (imgRect.right < wrapperRect.right) {
        fixTranslateX += Math.abs(wrapperRect.right - imgRect.right) / scale;
      }
    }
  }
  if (translateY) {
    if (wrapperRect.height > imgRect.height) {
      fixTranslateY = 0;
    } else {
      if (imgRect.top > wrapperRect.top) {
        fixTranslateY -= Math.abs(wrapperRect.top - imgRect.top) / scale;
      }
      if (imgRect.bottom < wrapperRect.bottom) {
        fixTranslateY += Math.abs(wrapperRect.bottom - imgRect.bottom) / scale;
      }
    }
  }
  return [fixTranslateX, fixTranslateY];
}
module.exports = getFixTranslate;
