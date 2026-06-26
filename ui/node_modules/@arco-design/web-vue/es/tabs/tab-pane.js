import { defineComponent, toRefs, getCurrentInstance, inject, ref, computed, reactive, onBeforeUnmount, watch, onUpdated, openBlock, createElementBlock, normalizeClass, renderSlot, createCommentVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { tabsInjectionKey } from "./context.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "TabPane",
  props: {
    title: String,
    disabled: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    },
    destroyOnHide: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots }) {
    var _a;
    const { title, disabled, closable } = toRefs(props);
    const instance = getCurrentInstance();
    const prefixCls = getPrefixCls("tabs");
    const tabsCtx = inject(tabsInjectionKey, {});
    const itemRef = ref();
    const key = computed(() => instance == null ? void 0 : instance.vnode.key);
    const active = computed(() => key.value === tabsCtx.activeKey);
    const mounted = ref(tabsCtx.lazyLoad ? active.value : true);
    const data = reactive({
      key,
      title,
      disabled,
      closable,
      slots
    });
    if (instance == null ? void 0 : instance.uid) {
      (_a = tabsCtx.addItem) == null ? void 0 : _a.call(tabsCtx, instance.uid, data);
    }
    onBeforeUnmount(() => {
      var _a2;
      if (instance == null ? void 0 : instance.uid) {
        (_a2 = tabsCtx.removeItem) == null ? void 0 : _a2.call(tabsCtx, instance.uid);
      }
    });
    watch(active, (active2) => {
      if (active2) {
        if (!mounted.value) {
          mounted.value = true;
        }
      } else if (props.destroyOnHide || tabsCtx.destroyOnHide) {
        mounted.value = false;
      }
    });
    onUpdated(() => {
      data.slots = { ...slots };
    });
    return {
      prefixCls,
      active,
      itemRef,
      mounted
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    ref: "itemRef",
    class: normalizeClass([
      `${_ctx.prefixCls}-content-item`,
      { [`${_ctx.prefixCls}-content-item-active`]: _ctx.active }
    ])
  }, [
    _ctx.mounted ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-pane`)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2)) : createCommentVNode("v-if", true)
  ], 2);
}
var TabPane = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { TabPane as default };
