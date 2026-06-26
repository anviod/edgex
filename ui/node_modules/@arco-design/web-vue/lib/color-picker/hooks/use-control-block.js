"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
const useControlBlock = ({ value, onChange }) => {
  const active = vue.ref(false);
  const blockRef = vue.ref();
  const handlerRef = vue.ref();
  const getPercentNumber = (value2, max) => {
    if (value2 < 0)
      return 0;
    if (value2 > max)
      return 1;
    return value2 / max;
  };
  const setCurrentPosition = (ev) => {
    if (!blockRef.value)
      return;
    const { clientX, clientY } = ev;
    const rect = blockRef.value.getBoundingClientRect();
    const newValue = [
      getPercentNumber(clientX - rect.x, rect.width),
      getPercentNumber(clientY - rect.y, rect.height)
    ];
    if (newValue[0] !== value[0] || newValue[1] !== value[1]) {
      onChange == null ? void 0 : onChange(newValue);
    }
  };
  const removeListener = () => {
    active.value = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", removeListener);
    window.removeEventListener("contextmenu", removeListener);
  };
  const onMouseDown = (ev) => {
    active.value = true;
    setCurrentPosition(ev);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", removeListener);
    window.addEventListener("contextmenu", removeListener);
  };
  function onMouseMove(ev) {
    ev.preventDefault();
    if (ev.buttons > 0) {
      setCurrentPosition(ev);
    } else {
      removeListener();
    }
  }
  return {
    active,
    blockRef,
    handlerRef,
    onMouseDown
  };
};
exports.useControlBlock = useControlBlock;
