const Color = require('color');
const colorPalette = require('./palette');
const { getColorString } = require('./utils');

// 暗色色板

// 动态梯度算法
function colorPaletteDark(originColor, i, format) {
  const lightColor = Color(colorPalette(originColor, 10 - i + 1));
  const originBaseColor = Color(originColor);

  const originBaseHue = originBaseColor.hue();
  const originBaseSaturation = originBaseColor.saturationv();
  const baseColor = Color({
    h: originBaseColor.hue(),
    s: getNewSaturation(6),
    v: originBaseColor.value(),
  });

  const baseSaturation = baseColor.saturationv();
  const step = Math.ceil((baseSaturation - 9) / 4);
  const step1to5 = Math.ceil((100 - baseSaturation) / 5);

  function getNewSaturation(_index) {
    if (_index < 6) {
      return baseSaturation + (6 - _index) * step1to5;
    }
    if (_index === 6) {
      if (originBaseHue >= 0 && originBaseHue < 50) {
        return originBaseSaturation - 15;
      }
      if (originBaseHue >= 50 && originBaseHue < 191) {
        return originBaseSaturation - 20;
      }
      if (originBaseHue >= 191 && originBaseHue <= 360) {
        return originBaseSaturation - 15;
      }
    }

    return baseSaturation - step * (_index - 6);
  }

  const retColor = Color({
    h: lightColor.hue(),
    s: getNewSaturation(i),
    v: lightColor.value(),
  });

  return getColorString(retColor, format);
}

module.exports = colorPaletteDark;