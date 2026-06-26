"use strict";
var vue = require("vue");
var picker = require("../picker.js");
var _DatePicker = vue.defineComponent({
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
    return () => vue.createVNode(picker, vue.mergeProps(props, attrs, {
      "mode": "date"
    }), slots);
  }
});
module.exports = _DatePicker;
