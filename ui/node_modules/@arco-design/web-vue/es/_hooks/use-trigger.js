import { ref, computed, watch } from "vue";
const useTrigger = ({
  popupVisible,
  defaultPopupVisible,
  emit
}) => {
  var _a;
  const _popupVisible = ref((_a = defaultPopupVisible == null ? void 0 : defaultPopupVisible.value) != null ? _a : false);
  const computedPopupVisible = computed(
    () => {
      var _a2;
      return (_a2 = popupVisible == null ? void 0 : popupVisible.value) != null ? _a2 : _popupVisible.value;
    }
  );
  const handlePopupVisibleChange = (visible) => {
    if (visible !== computedPopupVisible.value) {
      _popupVisible.value = visible;
      emit("update:popupVisible", visible);
      emit("popupVisibleChange", visible);
    }
  };
  watch(computedPopupVisible, (visible) => {
    if (_popupVisible.value !== visible) {
      _popupVisible.value = visible;
    }
  });
  return {
    computedPopupVisible,
    handlePopupVisibleChange
  };
};
export { useTrigger };
