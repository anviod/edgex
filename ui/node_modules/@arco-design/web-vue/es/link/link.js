import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, createBlock, renderSlot, createVNode, createCommentVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconLink from "../icon/icon-link/index.js";
import IconLoading from "../icon/icon-loading/index.js";
import { hasPropOrSlot } from "../_utils/use-prop-or-slot.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Link",
  components: { IconLink, IconLoading },
  props: {
    href: String,
    status: {
      type: String,
      default: "normal"
    },
    hoverable: {
      type: Boolean,
      default: true
    },
    icon: Boolean,
    loading: Boolean,
    disabled: Boolean
  },
  emits: {
    click: (ev) => true
  },
  setup(props, { slots, emit }) {
    const prefixCls = getPrefixCls("link");
    const showIcon = hasPropOrSlot(props, slots, "icon");
    const handleClick = (ev) => {
      if (props.disabled || props.loading) {
        ev.preventDefault();
        return;
      }
      emit("click", ev);
    };
    const cls = computed(() => [
      prefixCls,
      `${prefixCls}-status-${props.status}`,
      {
        [`${prefixCls}-disabled`]: props.disabled,
        [`${prefixCls}-loading`]: props.loading,
        [`${prefixCls}-hoverless`]: !props.hoverable,
        [`${prefixCls}-with-icon`]: props.loading || showIcon.value
      }
    ]);
    return {
      cls,
      prefixCls,
      showIcon,
      handleClick
    };
  }
});
const _hoisted_1 = ["href"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_loading = resolveComponent("icon-loading");
  const _component_icon_link = resolveComponent("icon-link");
  return openBlock(), createElementBlock("a", {
    href: _ctx.disabled ? void 0 : _ctx.href,
    class: normalizeClass(_ctx.cls),
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
  }, [
    _ctx.loading || _ctx.showIcon ? (openBlock(), createElementBlock("span", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-icon`)
    }, [
      _ctx.loading ? (openBlock(), createBlock(_component_icon_loading, { key: 0 })) : renderSlot(_ctx.$slots, "icon", { key: 1 }, () => [
        createVNode(_component_icon_link)
      ])
    ], 2)) : createCommentVNode("v-if", true),
    renderSlot(_ctx.$slots, "default")
  ], 10, _hoisted_1);
}
var _Link = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Link as default };
