"use strict";
var vue = require("vue");
var throttleByRaf = require("../../_utils/throttle-by-raf.js");
var useTreeContext = require("./use-tree-context.js");
function useDraggable(props) {
  const { key, refTitle } = vue.toRefs(props);
  const treeContext = useTreeContext();
  const isDragOver = vue.ref(false);
  const isDragging = vue.ref(false);
  const isAllowDrop = vue.ref(false);
  const dropPosition = vue.ref(0);
  const updateDropPosition = throttleByRaf.throttleByRaf((e) => {
    if (!refTitle.value)
      return;
    const rect = refTitle.value.getBoundingClientRect();
    const offsetY = window.pageYOffset + rect.top;
    const { pageY } = e;
    const gapHeight = rect.height / 4;
    const diff = pageY - offsetY;
    dropPosition.value = diff < gapHeight ? -1 : diff < rect.height - gapHeight ? 0 : 1;
    isAllowDrop.value = treeContext.allowDrop ? treeContext.allowDrop(key.value, dropPosition.value) : true;
  });
  return {
    isDragOver,
    isDragging,
    isAllowDrop,
    dropPosition,
    setDragStatus(status, e) {
      switch (status) {
        case "dragStart":
          isDragging.value = true;
          dropPosition.value = 0;
          treeContext.onDragStart && treeContext.onDragStart(key.value, e);
          break;
        case "dragEnd":
          isDragging.value = false;
          isDragOver.value = false;
          dropPosition.value = 0;
          updateDropPosition.cancel();
          treeContext.onDragEnd && treeContext.onDragEnd(key.value, e);
          break;
        case "dragOver":
          isDragOver.value = true;
          updateDropPosition(e);
          treeContext.onDragOver && treeContext.onDragOver(key.value, e);
          break;
        case "dragLeave":
          isDragOver.value = false;
          dropPosition.value = 0;
          updateDropPosition.cancel();
          treeContext.onDragLeave && treeContext.onDragLeave(key.value, e);
          break;
        case "drop":
          treeContext.onDrop && treeContext.onDrop(key.value, dropPosition.value, e);
          isDragOver.value = false;
          dropPosition.value = 0;
          updateDropPosition.cancel();
          break;
      }
    }
  };
}
module.exports = useDraggable;
