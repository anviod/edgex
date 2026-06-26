"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var is = require("../_utils/is.js");
var context = require("./context.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Collapse",
  props: {
    activeKey: {
      type: Array,
      default: void 0
    },
    defaultActiveKey: {
      type: Array,
      default: () => []
    },
    accordion: {
      type: Boolean,
      default: false
    },
    showExpandIcon: {
      type: Boolean,
      default: void 0
    },
    expandIconPosition: {
      type: String,
      default: "left"
    },
    bordered: {
      type: Boolean,
      default: true
    },
    destroyOnHide: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    "update:activeKey": (activeKey) => true,
    "change": (activeKey, ev) => true
  },
  setup(props, { emit, slots }) {
    const { expandIconPosition, destroyOnHide, showExpandIcon } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("collapse");
    const _activeKey = vue.ref(props.defaultActiveKey);
    const computedActiveKeys = vue.computed(() => {
      var _a;
      const activeKey = (_a = props.activeKey) != null ? _a : _activeKey.value;
      if (!is.isArray(activeKey)) {
        return [activeKey];
      }
      return activeKey;
    });
    const handleClick = (key, e) => {
      let newActiveKeys = [];
      if (props.accordion) {
        if (!computedActiveKeys.value.includes(key)) {
          newActiveKeys = [key];
        }
        _activeKey.value = newActiveKeys;
      } else {
        newActiveKeys = [...computedActiveKeys.value];
        const _index = newActiveKeys.indexOf(key);
        if (_index > -1) {
          newActiveKeys.splice(_index, 1);
        } else if (props.accordion) {
          newActiveKeys = [key];
        } else {
          newActiveKeys.push(key);
        }
        _activeKey.value = newActiveKeys;
      }
      emit("update:activeKey", newActiveKeys);
      emit("change", newActiveKeys, e);
    };
    vue.provide(
      context.collapseKey,
      vue.reactive({
        activeKeys: computedActiveKeys,
        slots,
        showExpandIcon,
        expandIconPosition,
        destroyOnHide,
        handleClick
      })
    );
    const cls = vue.computed(() => [
      prefixCls,
      {
        [`${prefixCls}-borderless`]: !props.bordered
      }
    ]);
    return {
      prefixCls,
      cls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.cls)
  }, [
    vue.renderSlot(_ctx.$slots, "default")
  ], 2);
}
var _Collapse = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Collapse;
