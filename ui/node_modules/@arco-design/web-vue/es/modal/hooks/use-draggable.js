import { ref } from "vue";
import { on, off } from "../../_utils/dom.js";
const useDraggable = ({
  modalRef,
  wrapperRef,
  draggable,
  alignCenter
}) => {
  const isDragging = ref(false);
  const startMouse = ref([0, 0]);
  const initialPosition = ref([0, 0]);
  const position = ref();
  const minPosition = ref([0, 0]);
  const maxPosition = ref([0, 0]);
  const getInitialPosition = () => {
    var _a, _b, _c;
    if (wrapperRef.value && modalRef.value) {
      const { top: wrapperTop, left: wrapperLeft } = wrapperRef.value.getBoundingClientRect();
      const { clientWidth: wrapperWidth, clientHeight: wrapperHeight } = wrapperRef.value;
      const { top, left, width, height } = modalRef.value.getBoundingClientRect();
      const offsetTop = alignCenter.value ? 0 : (_a = modalRef.value) == null ? void 0 : _a.offsetTop;
      const initialX = left - wrapperLeft;
      const initialY = top - wrapperTop - offsetTop;
      if (initialX !== ((_b = initialPosition.value) == null ? void 0 : _b[0]) || initialY !== ((_c = initialPosition.value) == null ? void 0 : _c[1])) {
        initialPosition.value = [initialX, initialY];
      }
      const maxX = wrapperWidth > width ? wrapperWidth - width : 0;
      const maxY = wrapperHeight > height ? wrapperHeight - height - offsetTop : 0;
      if (maxX !== maxPosition.value[0] || maxY !== maxPosition.value[1]) {
        maxPosition.value = [maxX, maxY];
      }
      if (offsetTop) {
        minPosition.value = [0, 0 - offsetTop];
      }
    }
  };
  const handleMoveDown = (ev) => {
    if (draggable.value) {
      ev.preventDefault();
      isDragging.value = true;
      getInitialPosition();
      startMouse.value = [ev.x, ev.y];
      on(window, "mousemove", handleMouseMove);
      on(window, "mouseup", handleMouseUp);
      on(window, "contextmenu", handleMouseUp);
    }
  };
  const handleMouseMove = (ev) => {
    if (isDragging.value) {
      const diffX = ev.x - startMouse.value[0];
      const diffY = ev.y - startMouse.value[1];
      let x = initialPosition.value[0] + diffX;
      let y = initialPosition.value[1] + diffY;
      if (x < minPosition.value[0])
        x = minPosition.value[0];
      if (x > maxPosition.value[0])
        x = maxPosition.value[0];
      if (y < minPosition.value[1])
        y = minPosition.value[1];
      if (y > maxPosition.value[1])
        y = maxPosition.value[1];
      position.value = [x, y];
    }
  };
  const handleMouseUp = () => {
    isDragging.value = false;
    off(window, "mousemove", handleMouseMove);
    off(window, "mouseup", handleMouseUp);
  };
  return {
    position,
    handleMoveDown
  };
};
export { useDraggable };
