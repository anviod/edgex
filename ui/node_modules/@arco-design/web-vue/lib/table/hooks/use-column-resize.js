"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var dom = require("../../_utils/dom.js");
const useColumnResize = (thRefs, emit) => {
  const resizingColumn = vue.ref("");
  const columnWidth = vue.reactive({});
  const handleThMouseDown = (dataIndex, ev) => {
    ev.preventDefault();
    resizingColumn.value = dataIndex;
    dom.on(window, "mousemove", handleThMouseMoving);
    dom.on(window, "mouseup", handleThMouseUp);
    dom.on(window, "contextmenu", handleThMouseUp);
  };
  const handleThMouseUp = () => {
    resizingColumn.value = "";
    dom.off(window, "mousemove", handleThMouseMoving);
    dom.off(window, "mouseup", handleThMouseUp);
    dom.off(window, "contextmenu", handleThMouseUp);
  };
  const handleThMouseMoving = (ev) => {
    const element = thRefs.value[resizingColumn.value];
    if (element) {
      const { clientX } = ev;
      const { x } = element.getBoundingClientRect();
      let width = Math.ceil(clientX - x);
      if (width < 40) {
        width = 40;
      }
      columnWidth[resizingColumn.value] = width;
      emit("columnResize", resizingColumn.value, width);
    }
  };
  return {
    resizingColumn,
    columnWidth,
    handleThMouseDown,
    handleThMouseUp
  };
};
exports.useColumnResize = useColumnResize;
