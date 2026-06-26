"use strict";
var vue = require("vue");
function useImageLoadStatus(defaultValue) {
  const status = vue.ref(defaultValue || "beforeLoad");
  const isBeforeLoad = vue.computed(() => status.value === "beforeLoad");
  const isLoading = vue.computed(() => status.value === "loading");
  const isError = vue.computed(() => status.value === "error");
  const isLoaded = vue.computed(() => status.value === "loaded");
  return {
    status,
    isBeforeLoad,
    isLoading,
    isError,
    isLoaded,
    setLoadStatus: (newStatus) => {
      status.value = newStatus;
    }
  };
}
module.exports = useImageLoadStatus;
