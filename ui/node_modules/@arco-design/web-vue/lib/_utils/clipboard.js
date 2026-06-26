"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const clipboard = async (text) => {
  var _a;
  if ((_a = navigator.clipboard) == null ? void 0 : _a.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (err) {
      console.error(
        err != null ? err : new DOMException("The request is not allowed", "NotAllowedError")
      );
    }
  }
  const span = document.createElement("span");
  span.textContent = text;
  span.style.whiteSpace = "pre";
  document.body.appendChild(span);
  const selection = window.getSelection();
  const range = window.document.createRange();
  selection == null ? void 0 : selection.removeAllRanges();
  range.selectNode(span);
  selection == null ? void 0 : selection.addRange(range);
  try {
    window.document.execCommand("copy");
  } catch (err) {
    console.error(`execCommand Error: ${err}`);
  }
  selection == null ? void 0 : selection.removeAllRanges();
  window.document.body.removeChild(span);
};
exports.clipboard = clipboard;
