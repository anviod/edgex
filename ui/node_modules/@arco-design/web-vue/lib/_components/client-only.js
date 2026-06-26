"use strict";
var vue = require("vue");
var ClientOnly = vue.defineComponent({
  name: "ClientOnly",
  setup(_, {
    slots
  }) {
    const mounted = vue.ref(false);
    vue.onMounted(() => mounted.value = true);
    return () => {
      var _a;
      if (mounted.value) {
        return (_a = slots.default) == null ? void 0 : _a.call(slots);
      }
      return null;
    };
  }
});
module.exports = ClientOnly;
