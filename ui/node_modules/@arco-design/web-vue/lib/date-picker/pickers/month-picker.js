"use strict";
var vue = require("vue");
var picker = require("../picker.js");
var MonthPicker = vue.defineComponent({
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
    return () => vue.createVNode(picker, vue.mergeProps(props, attrs, {
      "mode": "month"
    }), slots);
  }
});
module.exports = MonthPicker;
