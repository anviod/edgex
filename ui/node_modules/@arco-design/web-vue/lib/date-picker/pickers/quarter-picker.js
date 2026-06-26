"use strict";
var vue = require("vue");
var picker = require("../picker.js");
var QuarterPicker = vue.defineComponent({
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
    return () => vue.createVNode(picker, vue.mergeProps(props, attrs, {
      "mode": "quarter"
    }), slots);
  }
});
module.exports = QuarterPicker;
