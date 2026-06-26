import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createCommentVNode, createBlock, withCtx, createVNode, createTextVNode, toDisplayString } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconHover from "../_components/icon-hover.js";
import IconLeft from "../icon/icon-left/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "PageHeader",
  components: { AIconHover: IconHover, IconLeft },
  props: {
    title: String,
    subtitle: String,
    showBack: {
      type: Boolean,
      default: true
    }
  },
  emits: [
    "back"
  ],
  setup(props, { emit, slots }) {
    const prefixCls = getPrefixCls("page-header");
    const handleBack = (e) => {
      emit("back", e);
    };
    const cls = computed(() => [
      prefixCls,
      {
        [`${prefixCls}-with-breadcrumb`]: Boolean(slots.breadcrumb),
        [`${prefixCls}-with-content`]: Boolean(slots.default)
      }
    ]);
    return {
      prefixCls,
      cls,
      handleBack
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_left = resolveComponent("icon-left");
  const _component_a_icon_hover = resolveComponent("a-icon-hover");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.cls)
  }, [
    createElementVNode("div", {
      class: normalizeClass(`${_ctx.prefixCls}-wrapper`)
    }, [
      _ctx.$slots.breadcrumb ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(`${_ctx.prefixCls}-breadcrumb`)
      }, [
        renderSlot(_ctx.$slots, "breadcrumb")
      ], 2)) : createCommentVNode("v-if", true),
      createElementVNode("div", {
        class: normalizeClass(`${_ctx.prefixCls}-header`)
      }, [
        createElementVNode("span", {
          class: normalizeClass(`${_ctx.prefixCls}-main`)
        }, [
          _ctx.showBack ? (openBlock(), createBlock(_component_a_icon_hover, {
            key: 0,
            class: normalizeClass(`${_ctx.prefixCls}-back-btn`),
            prefix: _ctx.prefixCls,
            onClick: _ctx.handleBack
          }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "back-icon", {}, () => [
                createVNode(_component_icon_left)
              ])
            ]),
            _: 3
          }, 8, ["class", "prefix", "onClick"])) : createCommentVNode("v-if", true),
          createElementVNode("span", {
            class: normalizeClass(`${_ctx.prefixCls}-title`)
          }, [
            renderSlot(_ctx.$slots, "title", {}, () => [
              createTextVNode(toDisplayString(_ctx.title), 1)
            ])
          ], 2),
          _ctx.$slots.subtitle || _ctx.subtitle ? (openBlock(), createElementBlock("span", {
            key: 1,
            class: normalizeClass(`${_ctx.prefixCls}-divider`)
          }, null, 2)) : createCommentVNode("v-if", true),
          _ctx.$slots.subtitle || _ctx.subtitle ? (openBlock(), createElementBlock("span", {
            key: 2,
            class: normalizeClass(`${_ctx.prefixCls}-subtitle`)
          }, [
            renderSlot(_ctx.$slots, "subtitle", {}, () => [
              createTextVNode(toDisplayString(_ctx.subtitle), 1)
            ])
          ], 2)) : createCommentVNode("v-if", true)
        ], 2),
        _ctx.$slots.extra ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(`${_ctx.prefixCls}-extra`)
        }, [
          renderSlot(_ctx.$slots, "extra")
        ], 2)) : createCommentVNode("v-if", true)
      ], 2)
    ], 2),
    _ctx.$slots.default ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-content`)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2)) : createCommentVNode("v-if", true)
  ], 2);
}
var _PageHeader = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _PageHeader as default };
