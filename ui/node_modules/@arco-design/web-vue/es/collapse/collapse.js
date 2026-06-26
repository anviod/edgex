import { defineComponent, toRefs, ref, computed, provide, reactive, openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { isArray } from "../_utils/is.js";
import { collapseKey } from "./context.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
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
    const { expandIconPosition, destroyOnHide, showExpandIcon } = toRefs(props);
    const prefixCls = getPrefixCls("collapse");
    const _activeKey = ref(props.defaultActiveKey);
    const computedActiveKeys = computed(() => {
      var _a;
      const activeKey = (_a = props.activeKey) != null ? _a : _activeKey.value;
      if (!isArray(activeKey)) {
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
    provide(
      collapseKey,
      reactive({
        activeKeys: computedActiveKeys,
        slots,
        showExpandIcon,
        expandIconPosition,
        destroyOnHide,
        handleClick
      })
    );
    const cls = computed(() => [
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
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.cls)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var _Collapse = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Collapse as default };
