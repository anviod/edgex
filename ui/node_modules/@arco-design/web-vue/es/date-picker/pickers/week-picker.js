import { defineComponent, createVNode, mergeProps } from "vue";
import Picker from "../picker.js";
var WeekPicker = defineComponent({
  name: "WeekPicker",
  props: {
    modelValue: {
      type: [Object, String, Number]
    },
    defaultValue: {
      type: [Object, String, Number]
    },
    format: {
      type: String,
      default: "gggg-wo"
    },
    valueFormat: {
      type: String,
      default: "YYYY-MM-DD"
    },
    dayStartOfWeek: {
      type: Number,
      default: 0
    }
  },
  setup(props, {
    attrs,
    slots
  }) {
    return () => createVNode(Picker, mergeProps(props, attrs, {
      "mode": "week"
    }), slots);
  }
});
export { WeekPicker as default };
