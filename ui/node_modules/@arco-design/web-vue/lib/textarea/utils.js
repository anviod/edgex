"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const sizeStyles = [
  "border-width",
  "box-sizing",
  "font-family",
  "font-weight",
  "font-size",
  "font-variant",
  "letter-spacing",
  "line-height",
  "padding-top",
  "padding-bottom",
  "padding-left",
  "padding-right",
  "text-indent",
  "text-rendering",
  "text-transform",
  "white-space",
  "overflow-wrap",
  "width"
];
const getSizeStyles = (styleDeclaration) => {
  const styles = {};
  sizeStyles.forEach((item) => {
    styles[item] = styleDeclaration.getPropertyValue(item);
  });
  return styles;
};
exports.getSizeStyles = getSizeStyles;
