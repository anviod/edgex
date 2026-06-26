"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var useMutationObserver = require("./use-mutation-observer.js");
const THEME_TOKEN = "arco-theme";
const Theme = {
  Dark: "dark",
  Light: "light"
};
const useTheme = (callback) => {
  const theme = vue.ref(Theme.Light);
  const setTheme = (value) => {
    theme.value = value;
  };
  const getTheme = (element) => {
    return element.getAttribute(THEME_TOKEN) === Theme.Dark ? Theme.Dark : Theme.Light;
  };
  useMutationObserver.useMutationObserver(
    document.body,
    (mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === THEME_TOKEN) {
          setTheme(getTheme(mutation.target));
          callback == null ? void 0 : callback();
          break;
        }
      }
    },
    {
      attributes: true,
      attributeFilter: [THEME_TOKEN],
      subtree: false,
      childList: false,
      characterData: false
    }
  );
  setTheme(getTheme(document.body));
  return {
    theme,
    setTheme
  };
};
exports.useTheme = useTheme;
