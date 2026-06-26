function getStyle(element, prop) {
  if (!element || !prop)
    return null;
  let styleName = prop;
  if (styleName === "float") {
    styleName = "cssFloat";
  }
  try {
    if (document.defaultView) {
      const computed = document.defaultView.getComputedStyle(element, "");
      return element.style[styleName] || computed ? computed[styleName] : "";
    }
  } catch (e) {
    return element.style[styleName];
  }
  return null;
}
export { getStyle };
