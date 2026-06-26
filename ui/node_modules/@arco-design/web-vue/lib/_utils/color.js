"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const hsvToRgb = (h, s, v) => {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const mod = i % 6;
  const r = [v, q, p, p, t, v][mod];
  const g = [t, v, v, q, p, p][mod];
  const b = [p, p, t, v, v, q][mod];
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};
const rgbToHsv = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h, s, v };
};
const CSS_INTEGER = "[-\\+]?\\d+%?";
const CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
const CSS_UNIT = `(?:${CSS_NUMBER})|(?:${CSS_INTEGER})`;
const PERMISSIVE_MATCH3 = `[\\s|\\(]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})\\s*\\)?`;
const PERMISSIVE_MATCH4 = `[\\s|\\(]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})[,|\\s]+(${CSS_UNIT})\\s*\\)?`;
const matchers = {
  rgb: new RegExp(`rgb${PERMISSIVE_MATCH3}`),
  rgba: new RegExp(`rgba${PERMISSIVE_MATCH4}`),
  hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};
const parseIntFromHex = (val) => {
  return parseInt(val, 16);
};
const convertHexToDecimal = (h) => {
  return parseIntFromHex(h) / 255;
};
const formatInputToRgb = (color) => {
  let match = matchers.rgb.exec(color);
  if (match) {
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10)
    };
  }
  match = matchers.rgba.exec(color);
  if (match) {
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10),
      a: parseFloat(match[4])
    };
  }
  match = matchers.hex8.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      a: convertHexToDecimal(match[4])
    };
  }
  match = matchers.hex6.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3])
    };
  }
  match = matchers.hex4.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3]),
      a: convertHexToDecimal(match[4] + match[4])
    };
  }
  match = matchers.hex3.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3])
    };
  }
  return false;
};
const formatInputToHSVA = (color) => {
  var _a;
  const rgba = formatInputToRgb(color);
  if (rgba) {
    const hsv = rgbToHsv(rgba.r, rgba.g, rgba.b);
    return {
      ...hsv,
      a: (_a = rgba.a) != null ? _a : 1
    };
  }
  return {
    h: 0,
    s: 1,
    v: 1,
    a: 1
  };
};
const hexToRgb = (color) => {
  color = color.trim().toLowerCase();
  if (color.length === 0) {
    return false;
  }
  let match = matchers.hex6.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3])
    };
  }
  match = matchers.hex3.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3])
    };
  }
  return false;
};
const rgbToHex = (r, g, b) => {
  const hex = [
    Math.round(r).toString(16).padStart(2, "0"),
    Math.round(g).toString(16).padStart(2, "0"),
    Math.round(b).toString(16).padStart(2, "0")
  ];
  return hex.join("").toUpperCase();
};
const rgbaToHex = (r, g, b, a) => {
  const hex = [
    Math.round(r).toString(16).padStart(2, "0"),
    Math.round(g).toString(16).padStart(2, "0"),
    Math.round(b).toString(16).padStart(2, "0"),
    Math.round(a * 255).toString(16).padStart(2, "0")
  ];
  return hex.join("").toUpperCase();
};
exports.convertHexToDecimal = convertHexToDecimal;
exports.formatInputToHSVA = formatInputToHSVA;
exports.formatInputToRgb = formatInputToRgb;
exports.hexToRgb = hexToRgb;
exports.hsvToRgb = hsvToRgb;
exports.parseIntFromHex = parseIntFromHex;
exports.rgbToHex = rgbToHex;
exports.rgbToHsv = rgbToHsv;
exports.rgbaToHex = rgbaToHex;
