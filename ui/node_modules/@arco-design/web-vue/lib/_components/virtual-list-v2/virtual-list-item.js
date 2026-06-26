"use strict";
var vue = require("vue");
var vueUtils = require("../../_utils/vue-utils.js");
var VirtualListItem = vue.defineComponent({
  name: "VirtualListItem",
  props: {
    hasItemSize: {
      type: Function,
      required: true
    },
    setItemSize: {
      type: Function,
      required: true
    }
  },
  setup(props, {
    slots
  }) {
    var _a;
    const key = (_a = vue.getCurrentInstance()) == null ? void 0 : _a.vnode.key;
    const itemRef = vue.ref();
    const setItemSize = () => {
      var _a2, _b, _c, _d;
      const ele = (_b = (_a2 = itemRef.value) == null ? void 0 : _a2.$el) != null ? _b : itemRef.value;
      const height = (_d = (_c = ele == null ? void 0 : ele.getBoundingClientRect) == null ? void 0 : _c.call(ele).height) != null ? _d : ele == null ? void 0 : ele.offsetHeight;
      if (height) {
        props.setItemSize(key, height);
      }
    };
    vue.onMounted(() => setItemSize());
    vue.onBeforeUnmount(() => setItemSize());
    return () => {
      var _a2;
      const child = vueUtils.getFirstComponent((_a2 = slots.default) == null ? void 0 : _a2.call(slots));
      if (child) {
        return vue.cloneVNode(child, {
          ref: itemRef
        }, true);
      }
      return null;
    };
  }
});
module.exports = VirtualListItem;
