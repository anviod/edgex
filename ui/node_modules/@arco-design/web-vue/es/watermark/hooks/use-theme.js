import { ref } from "vue";
import { useMutationObserver } from "./use-mutation-observer.js";
const THEME_TOKEN = "arco-theme";
const Theme = {
  Dark: "dark",
  Light: "light"
};
const useTheme = (callback) => {
  const theme = ref(Theme.Light);
  const setTheme = (value) => {
    theme.value = value;
  };
  const getTheme = (element) => {
    return element.getAttribute(THEME_TOKEN) === Theme.Dark ? Theme.Dark : Theme.Light;
  };
  useMutationObserver(
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
export { useTheme };
