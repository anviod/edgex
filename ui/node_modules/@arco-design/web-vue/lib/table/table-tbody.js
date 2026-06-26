"use strict";
var vue = require("vue");
var Tbody = vue.defineComponent({
  name: "Tbody",
  setup(_, {
    slots
  }) {
    return () => {
      var _a, _b;
      return vue.createVNode((_b = (_a = slots.tbody) == null ? void 0 : _a.call(slots)[0]) != null ? _b : "tbody", null, {
        default: slots.default
      });
    };
  }
});
module.exports = Tbody;
