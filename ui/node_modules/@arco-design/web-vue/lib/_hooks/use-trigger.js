"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
const useTrigger = ({
  popupVisible,
  defaultPopupVisible,
  emit
}) => {
  var _a;
  const _popupVisible = vue.ref((_a = defaultPopupVisible == null ? void 0 : defaultPopupVisible.value) != null ? _a : false);
  const computedPopupVisible = vue.computed(
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
  vue.watch(computedPopupVisible, (visible) => {
    if (_popupVisible.value !== visible) {
      _popupVisible.value = visible;
    }
  });
  return {
    computedPopupVisible,
    handlePopupVisibleChange
  };
};
exports.useTrigger = useTrigger;
