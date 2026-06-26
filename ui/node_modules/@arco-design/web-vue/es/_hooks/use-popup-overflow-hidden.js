import { toRefs, watchEffect } from "vue";
function usePopupOverflowHidden(props) {
  const { container, hidden } = toRefs(props);
  let needResetContainerStyle = false;
  let originContainerStyle = {};
  const getScrollBarWidth = (element) => {
    return element.tagName === "BODY" ? window.innerWidth - (document.body.clientWidth || document.documentElement.clientWidth) : element.offsetWidth - element.clientWidth;
  };
  const setContainerStyle = () => {
    if (container.value && container.value.style.overflow !== "hidden") {
      const originStyle = container.value.style;
      needResetContainerStyle = true;
      const containerScrollBarWidth = getScrollBarWidth(container.value);
      if (containerScrollBarWidth) {
        originContainerStyle.width = originStyle.width;
        container.value.style.width = `calc(${container.value.style.width || "100%"} - ${containerScrollBarWidth}px)`;
      }
      originContainerStyle.overflow = originStyle.overflow;
      container.value.style.overflow = "hidden";
    }
  };
  const resetContainerStyle = () => {
    if (container.value && needResetContainerStyle) {
      const originStyle = originContainerStyle;
      Object.keys(originStyle).forEach((i) => {
        container.value.style[i] = originStyle[i];
      });
    }
    needResetContainerStyle = false;
    originContainerStyle = {};
  };
  watchEffect((onInvalidate) => {
    hidden.value ? setContainerStyle() : resetContainerStyle();
    onInvalidate(() => {
      resetContainerStyle();
    });
  });
  return [resetContainerStyle, setContainerStyle];
}
export { usePopupOverflowHidden as default };
