"use strict";
var vue = require("vue");
var picker = require("../picker.js");
var YearPicker = vue.defineComponent({
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
    return () => vue.createVNode(picker, vue.mergeProps(props, attrs, {
      "mode": "year"
    }), slots);
  }
});
module.exports = YearPicker;
