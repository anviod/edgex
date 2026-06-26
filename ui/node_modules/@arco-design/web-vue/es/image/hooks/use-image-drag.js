import { toRefs, ref, watchEffect, watch, nextTick } from "vue";
import { on, off } from "../../_utils/dom.js";
import getFixTranslate from "../utils/get-fix-translate.js";
function useImageDrag(props) {
  const { wrapperEl, imageEl, scale } = toRefs(props);
  const translate = ref([0, 0]);
  const moving = ref(false);
  let startPageX = 0;
  let startPageY = 0;
  let startTranslate = [0, 0];
  const checkAndFixTranslate = () => {
    if (!wrapperEl.value || !imageEl.value)
      return;
    const wrapperRect = wrapperEl.value.getBoundingClientRect();
    const imgRect = imageEl.value.getBoundingClientRect();
    const [x, y] = getFixTranslate(
      wrapperRect,
      imgRect,
      translate.value[0],
      translate.value[1],
      scale.value
    );
    if (x !== translate.value[0] || y !== translate.value[1]) {
      translate.value = [x, y];
    }
  };
  const onMoving = (e) => {
    e.preventDefault && e.preventDefault();
    const nextX = startTranslate[0] + (e.pageX - startPageX) / scale.value;
    const nextY = startTranslate[1] + (e.pageY - startPageY) / scale.value;
    translate.value = [nextX, nextY];
  };
  const onMoveEnd = (e) => {
    e.preventDefault && e.preventDefault();
    moving.value = false;
    checkAndFixTranslate();
    offEvents();
  };
  const onMoveStart = (e) => {
    if (e.target !== e.currentTarget)
      return;
    e.preventDefault && e.preventDefault();
    moving.value = true;
    startPageX = e.pageX;
    startPageY = e.pageY;
    startTranslate = [...translate.value];
    on(window, "mousemove", onMoving, false);
    on(window, "mouseup", onMoveEnd, false);
  };
  function offEvents() {
    off(window, "mousemove", onMoving, false);
    off(window, "mouseup", onMoveEnd, false);
  }
  watchEffect((onInvalidate) => {
    imageEl.value && on(imageEl.value, "mousedown", onMoveStart);
    onInvalidate(() => {
      imageEl.value && off(imageEl.value, "mousedown", onMoveStart);
      offEvents();
    });
  });
  watch([scale], () => {
    nextTick(() => checkAndFixTranslate());
  });
  return {
    translate,
    moving,
    resetTranslate() {
      translate.value = [0, 0];
    }
  };
}
export { useImageDrag as default };
