const generate = require('./generate');
const { getRgbStr } = require('./utils');

exports.generate = generate;
exports.getRgbStr = getRgbStr;

const colorList = {
  red: '#F53F3F',
  orangered: '#F77234',
  orange: '#FF7D00',
  gold: '#F7BA1E',
  yellow: '#FADC19',
  lime: '#9FDB1D',
  green: '#00B42A',
  cyan: '#14C9C9',
  blue: '#3491FA',
  arcoblue: '#165DFF',
  purple: '#722ED1',
  pinkpurple: '#D91AD9',
  magenta: '#F5319D',
};

function getPresetColors() {
  const presetColors = {};
  Object.keys(colorList).forEach((key) => {
    presetColors[key] = {};
    presetColors[key].light = generate(colorList[key], { list: true });
    presetColors[key].dark = generate(colorList[key], { list: true, dark: true });
    presetColors[key].primary = colorList[key];
  });

  presetColors.gray = {};
  presetColors.gray.light = [
    '#f7f8fa',
    '#f2f3f5',
    '#e5e6eb',
    '#c9cdd4',
    '#a9aeb8',
    '#86909c',
    '#6b7785',
    '#4e5969',
    '#272e3b',
    '#1d2129',
  ];
  presetColors.gray.dark = [
    '#17171a',
    '#2e2e30',
    '#484849',
    '#5f5f60',
    '#78787a',
    '#929293',
    '#ababac',
    '#c5c5c5',
    '#dfdfdf',
    '#f6f6f6',
  ];
  presetColors.gray.primary = presetColors.gray.light[6];

  return presetColors;
}

exports.getPresetColors = getPresetColors;
