const Color = require('color');
const { getColorString } = require('./utils');

// 色板

// 动态梯度算法
function colorPalette(originColor, i, format) {
  const color = Color(originColor);
  const h = color.hue();
  const s = color.saturationv();
  const v = color.value();

  const hueStep = 2;
  const maxSaturationStep = 100;
  const minSaturationStep = 9;

  const maxValue = 100;
  const minValue = 30;

  function getNewHue(isLight, i) {
    let hue;
    if (h >= 60 && h <= 240) {
      hue = isLight ? h - hueStep * i : h + hueStep * i;
    } else {
      hue = isLight ? h + hueStep * i : h - hueStep * i;
    }
    if (hue < 0) {
      hue += 360;
    } else if (hue >= 360) {
      hue -= 360;
    }
    return Math.round(hue);
  }

  function getNewSaturation(isLight, i) {
    let newSaturation;

    if (isLight) {
      newSaturation = s <= minSaturationStep ? s : s - ((s - minSaturationStep) / 5) * i;
    } else {
      newSaturation = s + ((maxSaturationStep - s) / 4) * i;
    }
    return newSaturation;
  }

  function getNewValue(isLight, i) {
    return isLight ? v + ((maxValue - v) / 5) * i : (v <= minValue ? v : v - ((v - minValue) / 4) * i);
  }

  const isLight = i < 6;
  const index = isLight ? 6 - i : i - 6;

  const retColor = i === 6
    ? color
    : Color({
        h: getNewHue(isLight, index),
        s: getNewSaturation(isLight, index),
        v: getNewValue(isLight, index),
      });
  
  return getColorString(retColor, format);
}

module.exports = colorPalette;
