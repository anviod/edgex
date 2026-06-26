import { defineComponent, createVNode, mergeProps } from "vue";
import Picker from "../picker.js";
var YearPicker = defineComponent({
  name: "YearPicker",
  props: {
    modelValue: {
      type: [Object, String, Number]
    },
    defaultValue: {
      type: [Object, String, Number]
    },
    format: {
      type: String,
      default: "YYYY"
    }
  },
  setup(props, {
    attrs,
    slots
  }) {
    return () => createVNode(Picker, mergeProps(props, attrs, {
      "mode": "year"
    }), slots);
  }
});
export { YearPicker as default };
