import { defineComponent, createVNode, mergeProps } from "vue";
import Picker from "../picker.js";
var MonthPicker = defineComponent({
  name: "MonthPicker",
  props: {
    modelValue: {
      type: [Object, String, Number]
    },
    defaultValue: {
      type: [Object, String, Number]
    },
    format: {
      type: String,
      default: "YYYY-MM"
    }
  },
  setup(props, {
    attrs,
    slots
  }) {
    return () => createVNode(Picker, mergeProps(props, attrs, {
      "mode": "month"
    }), slots);
  }
});
export { MonthPicker as default };
