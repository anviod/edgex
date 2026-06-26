import { defineComponent, onMounted, onUpdated, onUnmounted, resolveComponent, openBlock, createElementBlock, normalizeClass, renderSlot, createBlock, createCommentVNode, createElementVNode, createVNode, withCtx } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconHover from "../_components/icon-hover.js";
import IconClose from "../icon/icon-close/index.js";
import IconInfoCircleFill from "../icon/icon-info-circle-fill/index.js";
import IconCheckCircleFill from "../icon/icon-check-circle-fill/index.js";
import IconExclamationCircleFill from "../icon/icon-exclamation-circle-fill/index.js";
import IconCloseCircleFill from "../icon/icon-close-circle-fill/index.js";
import IconLoading from "../icon/icon-loading/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Message",
  components: {
    AIconHover: IconHover,
    IconInfoCircleFill,
    IconCheckCircleFill,
    IconExclamationCircleFill,
    IconCloseCircleFill,
    IconClose,
    IconLoading
  },
  props: {
    type: {
      type: String,
      default: "info"
    },
    closable: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    duration: {
      type: Number,
      default: 3e3
    },
    resetOnUpdate: {
      type: Boolean,
      default: false
    },
    resetOnHover: {
      type: Boolean,
      default: false
    }
  },
  emits: ["close"],
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("message");
    let timer = 0;
    const handleClose = () => {
      emit("close");
    };
    const startTimer = () => {
      if (props.duration > 0) {
        timer = window.setTimeout(handleClose, props.duration);
      }
    };
    const clearTimer = () => {
      if (timer) {
        window.clearTimeout(timer);
        timer = 0;
      }
    };
    onMounted(() => {
      startTimer();
    });
    onUpdated(() => {
      if (props.resetOnUpdate) {
        clearTimer();
        startTimer();
      }
    });
    onUnmounted(() => {
      clearTimer();
    });
    const handleMouseEnter = () => {
      if (props.resetOnHover) {
        clearTimer();
      }
    };
    const handleMouseLeave = () => {
      if (props.resetOnHover) {
        startTimer();
      }
    };
    return {
      handleMouseEnter,
      handleMouseLeave,
      prefixCls,
      handleClose
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_info_circle_fill = resolveComponent("icon-info-circle-fill");
  const _component_icon_check_circle_fill = resolveComponent("icon-check-circle-fill");
  const _component_icon_exclamation_circle_fill = resolveComponent("icon-exclamation-circle-fill");
  const _component_icon_close_circle_fill = resolveComponent("icon-close-circle-fill");
  const _component_icon_loading = resolveComponent("icon-loading");
  const _component_icon_close = resolveComponent("icon-close");
  const _component_a_icon_hover = resolveComponent("a-icon-hover");
  return openBlock(), createElementBlock("li", {
    role: "alert",
    class: normalizeClass([
      _ctx.prefixCls,
      `${_ctx.prefixCls}-${_ctx.type}`,
      { [`${_ctx.prefixCls}-closable`]: _ctx.closable }
    ]),
    onMouseenter: _cache[1] || (_cache[1] = (...args) => _ctx.handleMouseEnter && _ctx.handleMouseEnter(...args)),
    onMouseleave: _cache[2] || (_cache[2] = (...args) => _ctx.handleMouseLeave && _ctx.handleMouseLeave(...args))
  }, [
    _ctx.showIcon && !(_ctx.type === "normal" && !_ctx.$slots.icon) ? (openBlock(), createElementBlock("span", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-icon`)
    }, [
      renderSlot(_ctx.$slots, "icon", {}, () => [
        _ctx.type === "info" ? (openBlock(), createBlock(_component_icon_info_circle_fill, { key: 0 })) : _ctx.type === "success" ? (openBlock(), createBlock(_component_icon_check_circle_fill, { key: 1 })) : _ctx.type === "warning" ? (openBlock(), createBlock(_component_icon_exclamation_circle_fill, { key: 2 })) : _ctx.type === "error" ? (openBlock(), createBlock(_component_icon_close_circle_fill, { key: 3 })) : _ctx.type === "loading" ? (openBlock(), createBlock(_component_icon_loading, { key: 4 })) : createCommentVNode("v-if", true)
      ])
    ], 2)) : createCommentVNode("v-if", true),
    createElementVNode("span", {
      class: normalizeClass(`${_ctx.prefixCls}-content`)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2),
    _ctx.closable ? (openBlock(), createElementBlock("span", {
      key: 1,
      class: normalizeClass(`${_ctx.prefixCls}-close-btn`),
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClose && _ctx.handleClose(...args))
    }, [
      createVNode(_component_a_icon_hover, null, {
        default: withCtx(() => [
          createVNode(_component_icon_close)
        ]),
        _: 1
      })
    ], 2)) : createCommentVNode("v-if", true)
  ], 34);
}
var Message = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Message as default };
