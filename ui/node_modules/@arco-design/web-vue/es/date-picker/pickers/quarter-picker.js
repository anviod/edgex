import { defineComponent, createVNode, mergeProps } from "vue";
import Picker from "../picker.js";
var QuarterPicker = defineComponent({
  name: "QuarterPicker",
  props: {
    modelValue: {
      type: [Object, String, Number]
    },
    defaultValue: {
      type: [Object, String, Number]
    },
    format: {
      type: String,
      default: "YYYY-[Q]Q"
    },
    valueFormat: {
      type: String,
      default: "YYYY-MM"
    }
  },
  setup(props, {
    attrs,
    slots
  }) {
    return () => createVNode(Picker, mergeProps(props, attrs, {
      "mode": "quarter"
    }), slots);
  }
});
export { QuarterPicker as default };
