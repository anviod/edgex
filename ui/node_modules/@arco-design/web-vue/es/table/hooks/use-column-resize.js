import { ref, reactive } from "vue";
import { on, off } from "../../_utils/dom.js";
const useColumnResize = (thRefs, emit) => {
  const resizingColumn = ref("");
  const columnWidth = reactive({});
  const handleThMouseDown = (dataIndex, ev) => {
    ev.preventDefault();
    resizingColumn.value = dataIndex;
    on(window, "mousemove", handleThMouseMoving);
    on(window, "mouseup", handleThMouseUp);
    on(window, "contextmenu", handleThMouseUp);
  };
  const handleThMouseUp = () => {
    resizingColumn.value = "";
    off(window, "mousemove", handleThMouseMoving);
    off(window, "mouseup", handleThMouseUp);
    off(window, "contextmenu", handleThMouseUp);
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
export { useColumnResize };
