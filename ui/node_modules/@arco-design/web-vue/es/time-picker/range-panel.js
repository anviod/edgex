import { defineComponent, toRefs, ref, watch, computed, createVNode } from "vue";
import { isUndefined } from "../_utils/is.js";
import Panel from "./panel.js";
import { isValidRangeValue } from "./utils/index.js";
var RangePanel = defineComponent({
  name: "TimePickerRangePanel",
  components: {
    Panel
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
    } = toRefs(props);
    const localDisplayIndex = ref(displayIndex.value);
    watch(displayIndex, () => {
      localDisplayIndex.value = displayIndex.value;
    });
    const displayValue = computed(() => (value == null ? void 0 : value.value) ? value.value[localDisplayIndex.value] : void 0);
    function onSelect(selectedValue) {
      const newValue = isUndefined(value) || isUndefined(value == null ? void 0 : value.value) ? [] : [...value.value];
      newValue[localDisplayIndex.value] = selectedValue;
      emit("select", newValue);
    }
    function onConfirm() {
      if (!isValidRangeValue(value == null ? void 0 : value.value)) {
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
    return createVNode(Panel, _props, this.$slots);
  }
});
export { RangePanel as default };
