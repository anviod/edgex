"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var Tr = vue.defineComponent({
  name: "Tr",
  props: {
    expand: {
      type: Boolean
    },
    empty: {
      type: Boolean
    },
    checked: {
      type: Boolean
    },
    rowIndex: Number,
    record: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, {
    slots
  }) {
    const prefixCls = globalConfig.getPrefixCls("table");
    const cls = vue.computed(() => [`${prefixCls}-tr`, {
      [`${prefixCls}-tr-expand`]: props.expand,
      [`${prefixCls}-tr-empty`]: props.empty,
      [`${prefixCls}-tr-checked`]: props.checked
    }]);
    return () => {
      var _a, _b, _c;
      return vue.createVNode((_c = (_b = slots.tr) == null ? void 0 : _b.call(slots, {
        rowIndex: props.rowIndex,
        record: (_a = props.record) == null ? void 0 : _a.raw
      })[0]) != null ? _c : "tr", {
        class: cls.value
      }, {
        default: slots.default
      });
    };
  }
});
module.exports = Tr;
