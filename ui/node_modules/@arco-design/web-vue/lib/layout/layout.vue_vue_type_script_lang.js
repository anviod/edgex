"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var context = require("./context.js");
var _sfc_main = vue.defineComponent({
  name: "Layout",
  props: {
    hasSider: {
      type: Boolean
    }
  },
  setup(props) {
    const siderIds = vue.ref([]);
    const prefixCls = globalConfig.getPrefixCls("layout");
    const classNames = vue.computed(() => [prefixCls, {
      [`${prefixCls}-has-sider`]: props.hasSider || siderIds.value.length
    }]);
    vue.provide(context.LayoutSiderInjectionKey, {
      onSiderMount: (id) => siderIds.value.push(id),
      onSiderUnMount: (id) => {
        siderIds.value = siderIds.value.filter((_id) => _id !== id);
      }
    });
    return {
      classNames
    };
  }
});
module.exports = _sfc_main;
