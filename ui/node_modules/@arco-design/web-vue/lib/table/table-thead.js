"use strict";
var vue = require("vue");
var Thead = vue.defineComponent({
  name: "Thead",
  setup(_, {
    slots
  }) {
    return () => {
      var _a, _b;
      return vue.createVNode((_b = (_a = slots.thead) == null ? void 0 : _a.call(slots)[0]) != null ? _b : "thead", null, {
        default: slots.default
      });
    };
  }
});
module.exports = Thead;
