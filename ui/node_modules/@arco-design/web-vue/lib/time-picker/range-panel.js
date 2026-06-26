"use strict";
var vue = require("vue");
var is = require("../_utils/is.js");
var panel = require("./panel.js");
var index = require("./utils/index.js");
var RangePanel = vue.defineComponent({
  name: "TimePickerRangePanel",
  components: {
    Panel: panel
  },
  props: {
    value: {
      type: Array
    },
    displayIndex: {
      type: Number,
      default: 0
    }
  },
  emits: ["select", "confirm", "update:displayIndex", "display-index-change"],
  setup(props, {
    emit
  }) {
    const {
      value,
      displayIndex
    } = vue.toRefs(props);
    const localDisplayIndex = vue.ref(displayIndex.value);
    vue.watch(displayIndex, () => {
      localDisplayIndex.value = displayIndex.value;
    });
    const displayValue = vue.computed(() => (value == null ? void 0 : value.value) ? value.value[localDisplayIndex.value] : void 0);
    function onSelect(selectedValue) {
      const newValue = is.isUndefined(value) || is.isUndefined(value == null ? void 0 : value.value) ? [] : [...value.value];
      newValue[localDisplayIndex.value] = selectedValue;
      emit("select", newValue);
    }
    function onConfirm() {
      if (!index.isValidRangeValue(value == null ? void 0 : value.value)) {
        const newIndex = (localDisplayIndex.value + 1) % 2;
        localDisplayIndex.value = newIndex;
        emit("display-index-change", newIndex);
        emit("update:displayIndex", newIndex);
      } else {
        emit("confirm", value == null ? void 0 : value.value);
      }
    }
    return {
      displayValue,
      onSelect,
      onConfirm
    };
  },
  render() {
    const _props = {
      ...this.$attrs,
      isRange: true,
      value: this.displayValue,
      onSelect: this.onSelect,
      onConfirm: this.onConfirm
    };
    return vue.createVNode(panel, _props, this.$slots);
  }
});
module.exports = RangePanel;
