import { ref, computed } from "vue";
function useImageLoadStatus(defaultValue) {
  const status = ref(defaultValue || "beforeLoad");
  const isBeforeLoad = computed(() => status.value === "beforeLoad");
  const isLoading = computed(() => status.value === "loading");
  const isError = computed(() => status.value === "error");
  const isLoaded = computed(() => status.value === "loaded");
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
export { useImageLoadStatus as default };
