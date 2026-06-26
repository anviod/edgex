import { defineComponent, onMounted, onUpdated, onUnmounted, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createBlock, createCommentVNode, createVNode, withCtx } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconHover from "../_components/icon-hover.js";
import IconClose from "../icon/icon-close/index.js";
import IconInfoCircleFill from "../icon/icon-info-circle-fill/index.js";
import IconCheckCircleFill from "../icon/icon-check-circle-fill/index.js";
import IconExclamationCircleFill from "../icon/icon-exclamation-circle-fill/index.js";
import IconCloseCircleFill from "../icon/icon-close-circle-fill/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Notification",
  components: {
    AIconHover: IconHover,
    IconInfoCircleFill,
    IconCheckCircleFill,
    IconExclamationCircleFill,
    IconCloseCircleFill,
    IconClose
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
    duration: {
      type: Number,
      default: 3e3
    },
    resetOnUpdate: {
      type: Boolean,
      default: false
    }
  },
  emits: ["close"],
  setup(props, context) {
    const prefixCls = getPrefixCls("notification");
    let timer = 0;
    const handleClose = () => {
      context.emit("close");
    };
    onMounted(() => {
      if (props.duration > 0) {
        timer = window.setTimeout(handleClose, props.duration);
      }
    });
    onUpdated(() => {
      if (props.resetOnUpdate) {
        if (timer) {
          window.clearTimeout(timer);
          timer = 0;
        }
        if (props.duration > 0) {
          timer = window.setTimeout(handleClose, props.duration);
        }
      }
    });
    onUnmounted(() => {
      if (timer) {
        window.clearTimeout(timer);
      }
    });
    return {
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
  const _component_icon_close = resolveComponent("icon-close");
  const _component_a_icon_hover = resolveComponent("a-icon-hover");
  return openBlock(), createElementBlock("li", {
    role: "alert",
    class: normalizeClass([
      _ctx.prefixCls,
      `${_ctx.prefixCls}-${_ctx.type}`,
      { [`${_ctx.prefixCls}-closable`]: _ctx.closable }
    ])
  }, [
    _ctx.showIcon ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-left`)
    }, [
      createElementVNode("div", {
        class: normalizeClass(`${_ctx.prefixCls}-icon`)
      }, [
        renderSlot(_ctx.$slots, "icon", {}, () => [
          _ctx.type === "info" ? (openBlock(), createBlock(_component_icon_info_circle_fill, { key: 0 })) : _ctx.type === "success" ? (openBlock(), createBlock(_component_icon_check_circle_fill, { key: 1 })) : _ctx.type === "warning" ? (openBlock(), createBlock(_component_icon_exclamation_circle_fill, { key: 2 })) : _ctx.type === "error" ? (openBlock(), createBlock(_component_icon_close_circle_fill, { key: 3 })) : createCommentVNode("v-if", true)
        ])
      ], 2)
    ], 2)) : createCommentVNode("v-if", true),
    createElementVNode("div", {
      class: normalizeClass(`${_ctx.prefixCls}-right`)
    }, [
      _ctx.$slots.default ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(`${_ctx.prefixCls}-title`)
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2)) : createCommentVNode("v-if", true),
      _ctx.$slots.content ? (openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass(`${_ctx.prefixCls}-content`)
      }, [
        renderSlot(_ctx.$slots, "content")
      ], 2)) : createCommentVNode("v-if", true),
      _ctx.$slots.footer ? (openBlock(), createElementBlock("div", {
        key: 2,
        class: normalizeClass(`${_ctx.prefixCls}-footer`)
      }, [
        renderSlot(_ctx.$slots, "footer")
      ], 2)) : createCommentVNode("v-if", true)
    ], 2),
    _ctx.closable ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass(`${_ctx.prefixCls}-close-btn`),
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClose && _ctx.handleClose(...args))
    }, [
      renderSlot(_ctx.$slots, "closeIconElement", {}, () => [
        createVNode(_component_a_icon_hover, null, {
          default: withCtx(() => [
            renderSlot(_ctx.$slots, "closeIcon", {}, () => [
              createVNode(_component_icon_close)
            ])
          ]),
          _: 3
        })
      ])
    ], 2)) : createCommentVNode("v-if", true)
  ], 2);
}
var Notification = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Notification as default };
