"use strict";
var vue = require("vue");
var picker = require("../picker.js");
var WeekPicker = vue.defineComponent({
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
    return () => vue.createVNode(picker, vue.mergeProps(props, attrs, {
      "mode": "week"
    }), slots);
  }
});
module.exports = WeekPicker;
