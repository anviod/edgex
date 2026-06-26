import { defineComponent, ref, computed, resolveComponent, openBlock, createBlock, Transition, withCtx, createElementBlock, normalizeClass, renderSlot, createCommentVNode, createElementVNode, createTextVNode, toDisplayString, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconHover from "../_components/icon-hover.js";
import IconClose from "../icon/icon-close/index.js";
import IconInfoCircleFill from "../icon/icon-info-circle-fill/index.js";
import IconCheckCircleFill from "../icon/icon-check-circle-fill/index.js";
import IconExclamationCircleFill from "../icon/icon-exclamation-circle-fill/index.js";
import IconCloseCircleFill from "../icon/icon-close-circle-fill/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Alert",
  components: {
    IconHover,
    IconClose,
    IconInfoCircleFill,
    IconCheckCircleFill,
    IconExclamationCircleFill,
    IconCloseCircleFill
  },
  props: {
    type: {
      type: String,
      default: "info"
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    closable: {
      type: Boolean,
      default: false
    },
    title: String,
    banner: {
      type: Boolean,
      default: false
    },
    center: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    close: (ev) => true,
    afterClose: () => true
  },
  setup(props, { slots, emit }) {
    const prefixCls = getPrefixCls("alert");
    const visible = ref(true);
    const handleClose = (ev) => {
      visible.value = false;
      emit("close", ev);
    };
    const handleAfterLeave = () => {
      emit("afterClose");
    };
    const cls = computed(() => [
      prefixCls,
      `${prefixCls}-${props.type}`,
      {
        [`${prefixCls}-with-title`]: Boolean(props.title || slots.title),
        [`${prefixCls}-banner`]: props.banner,
        [`${prefixCls}-center`]: props.center
      }
    ]);
    return {
      prefixCls,
      cls,
      visible,
      handleClose,
      handleAfterLeave
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_info_circle_fill = resolveComponent("icon-info-circle-fill");
  const _component_icon_check_circle_fill = resolveComponent("icon-check-circle-fill");
  const _component_icon_exclamation_circle_fill = resolveComponent("icon-exclamation-circle-fill");
  const _component_icon_close_circle_fill = resolveComponent("icon-close-circle-fill");
  const _component_icon_close = resolveComponent("icon-close");
  const _component_icon_hover = resolveComponent("icon-hover");
  return openBlock(), createBlock(Transition, {
    name: "zoom-in-top",
    onAfterLeave: _ctx.handleAfterLeave
  }, {
    default: withCtx(() => [
      _ctx.visible ? (openBlock(), createElementBlock("div", {
        key: 0,
        role: "alert",
        class: normalizeClass(_ctx.cls)
      }, [
        _ctx.showIcon && !(_ctx.type === "normal" && !_ctx.$slots.icon) ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(`${_ctx.prefixCls}-icon`)
        }, [
          renderSlot(_ctx.$slots, "icon", {}, () => [
            _ctx.type === "info" ? (openBlock(), createBlock(_component_icon_info_circle_fill, { key: 0 })) : _ctx.type === "success" ? (openBlock(), createBlock(_component_icon_check_circle_fill, { key: 1 })) : _ctx.type === "warning" ? (openBlock(), createBlock(_component_icon_exclamation_circle_fill, { key: 2 })) : _ctx.type === "error" ? (openBlock(), createBlock(_component_icon_close_circle_fill, { key: 3 })) : createCommentVNode("v-if", true)
          ])
        ], 2)) : createCommentVNode("v-if", true),
        createElementVNode("div", {
          class: normalizeClass(`${_ctx.prefixCls}-body`)
        }, [
          _ctx.title || _ctx.$slots.title ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(`${_ctx.prefixCls}-title`)
          }, [
            renderSlot(_ctx.$slots, "title", {}, () => [
              createTextVNode(toDisplayString(_ctx.title), 1)
            ])
          ], 2)) : createCommentVNode("v-if", true),
          createElementVNode("div", {
            class: normalizeClass(`${_ctx.prefixCls}-content`)
          }, [
            renderSlot(_ctx.$slots, "default")
          ], 2)
        ], 2),
        _ctx.$slots.action ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass(`${_ctx.prefixCls}-action`)
        }, [
          renderSlot(_ctx.$slots, "action")
        ], 2)) : createCommentVNode("v-if", true),
        _ctx.closable ? (openBlock(), createElementBlock("div", {
          key: 2,
          tabindex: "-1",
          role: "button",
          "aria-label": "Close",
          class: normalizeClass(`${_ctx.prefixCls}-close-btn`),
          onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClose && _ctx.handleClose(...args))
        }, [
          renderSlot(_ctx.$slots, "close-element", {}, () => [
            createVNode(_component_icon_hover, null, {
              default: withCtx(() => [
                createVNode(_component_icon_close)
              ]),
              _: 1
            })
          ])
        ], 2)) : createCommentVNode("v-if", true)
      ], 2)) : createCommentVNode("v-if", true)
    ]),
    _: 3
  }, 8, ["onAfterLeave"]);
}
var _Alert = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Alert as default };
