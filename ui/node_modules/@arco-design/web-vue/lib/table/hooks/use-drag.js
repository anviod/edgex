"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
const useDrag = (draggable) => {
  const dragType = vue.computed(() => {
    if (draggable.value) {
      if (draggable.value.type === "handle") {
        return "handle";
      }
      return "row";
    }
    return void 0;
  });
  const dragState = vue.reactive({
    dragging: false,
    sourceKey: "",
    sourcePath: [],
    targetPath: [],
    data: {}
  });
  const clearDragState = () => {
    dragState.dragging = false;
    dragState.sourceKey = "";
    dragState.sourcePath = [];
    dragState.targetPath = [];
    dragState.data = {};
  };
  const handleDragStart = (ev, sourceKey, sourcePath, data) => {
    if (ev.dataTransfer) {
      ev.dataTransfer.effectAllowed = "move";
      if (ev.target && ev.target.tagName === "TD") {
        const { parentElement } = ev.target;
        if (parentElement && parentElement.tagName === "TR") {
          ev.dataTransfer.setDragImage(parentElement, 0, 0);
        }
      }
    }
    dragState.dragging = true;
    dragState.sourceKey = sourceKey;
    dragState.sourcePath = sourcePath;
    dragState.targetPath = [...sourcePath];
    dragState.data = data;
  };
  const handleDragEnter = (ev, targetPath) => {
    if (ev.dataTransfer) {
      ev.dataTransfer.dropEffect = "move";
    }
    if (dragState.targetPath.toString() !== targetPath.toString()) {
      dragState.targetPath = targetPath;
    }
    ev.preventDefault();
  };
  const handleDragLeave = (ev) => {
  };
  const handleDragover = (ev) => {
    if (ev.dataTransfer) {
      ev.dataTransfer.dropEffect = "move";
    }
    ev.preventDefault();
  };
  const handleDragEnd = (ev) => {
    var _a;
    if (((_a = ev.dataTransfer) == null ? void 0 : _a.dropEffect) === "none") {
      clearDragState();
    }
  };
  const handleDrop = (ev) => {
    clearDragState();
    ev.preventDefault();
  };
  return {
    dragType,
    dragState,
    handleDragStart,
    handleDragEnter,
    handleDragLeave,
    handleDragover,
    handleDragEnd,
    handleDrop
  };
};
exports.useDrag = useDrag;
