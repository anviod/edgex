import { defineComponent, createVNode, mergeProps } from "vue";
import Picker from "../picker.js";
var _DatePicker = defineComponent({
  name: "DatePicker",
  props: {
    modelValue: {
      type: [Object, String, Number]
    },
    defaultValue: {
      type: [Object, String, Number]
    },
    format: {
      type: [String, Function]
    },
    dayStartOfWeek: {
      type: Number,
      default: 0
    },
    showTime: {
      type: Boolean
    },
    timePickerProps: {
      type: Object
    },
    disabled: {
      type: Boolean
    },
    disabledDate: {
      type: Function
    },
    disabledTime: {
      type: Function
    },
    showNowBtn: {
      type: Boolean,
      default: true
    }
  },
  setup(props, {
    attrs,
    slots
  }) {
    return () => createVNode(Picker, mergeProps(props, attrs, {
      "mode": "date"
    }), slots);
  }
});
export { _DatePicker as default };
