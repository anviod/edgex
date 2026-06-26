"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var iconHover = require("../_components/icon-hover.js");
var index$4 = require("../icon/icon-close/index.js");
var index = require("../icon/icon-info-circle-fill/index.js");
var index$1 = require("../icon/icon-check-circle-fill/index.js");
var index$2 = require("../icon/icon-exclamation-circle-fill/index.js");
var index$3 = require("../icon/icon-close-circle-fill/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Notification",
  components: {
    AIconHover: iconHover,
    IconInfoCircleFill: index,
    IconCheckCircleFill: index$1,
    IconExclamationCircleFill: index$2,
    IconCloseCircleFill: index$3,
    IconClose: index$4
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
    const prefixCls = globalConfig.getPrefixCls("notification");
    let timer = 0;
    const handleClose = () => {
      context.emit("close");
    };
    vue.onMounted(() => {
      if (props.duration > 0) {
        timer = window.setTimeout(handleClose, props.duration);
      }
    });
    vue.onUpdated(() => {
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
    vue.onUnmounted(() => {
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
  const _component_icon_info_circle_fill = vue.resolveComponent("icon-info-circle-fill");
  const _component_icon_check_circle_fill = vue.resolveComponent("icon-check-circle-fill");
  const _component_icon_exclamation_circle_fill = vue.resolveComponent("icon-exclamation-circle-fill");
  const _component_icon_close_circle_fill = vue.resolveComponent("icon-close-circle-fill");
  const _component_icon_close = vue.resolveComponent("icon-close");
  const _component_a_icon_hover = vue.resolveComponent("a-icon-hover");
  return vue.openBlock(), vue.createElementBlock("li", {
    role: "alert",
    class: vue.normalizeClass([
      _ctx.prefixCls,
      `${_ctx.prefixCls}-${_ctx.type}`,
      { [`${_ctx.prefixCls}-closable`]: _ctx.closable }
    ])
  }, [
    _ctx.showIcon ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-left`)
    }, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-icon`)
      }, [
        vue.renderSlot(_ctx.$slots, "icon", {}, () => [
          _ctx.type === "info" ? (vue.openBlock(), vue.createBlock(_component_icon_info_circle_fill, { key: 0 })) : _ctx.type === "success" ? (vue.openBlock(), vue.createBlock(_component_icon_check_circle_fill, { key: 1 })) : _ctx.type === "warning" ? (vue.openBlock(), vue.createBlock(_component_icon_exclamation_circle_fill, { key: 2 })) : _ctx.type === "error" ? (vue.openBlock(), vue.createBlock(_component_icon_close_circle_fill, { key: 3 })) : vue.createCommentVNode("v-if", true)
        ])
      ], 2)
    ], 2)) : vue.createCommentVNode("v-if", true),
    vue.createElementVNode("div", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-right`)
    }, [
      _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass(`${_ctx.prefixCls}-title`)
      }, [
        vue.renderSlot(_ctx.$slots, "default")
      ], 2)) : vue.createCommentVNode("v-if", true),
      _ctx.$slots.content ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 1,
        class: vue.normalizeClass(`${_ctx.prefixCls}-content`)
      }, [
        vue.renderSlot(_ctx.$slots, "content")
      ], 2)) : vue.createCommentVNode("v-if", true),
      _ctx.$slots.footer ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 2,
        class: vue.normalizeClass(`${_ctx.prefixCls}-footer`)
      }, [
        vue.renderSlot(_ctx.$slots, "footer")
      ], 2)) : vue.createCommentVNode("v-if", true)
    ], 2),
    _ctx.closable ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 1,
      class: vue.normalizeClass(`${_ctx.prefixCls}-close-btn`),
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClose && _ctx.handleClose(...args))
    }, [
      vue.renderSlot(_ctx.$slots, "closeIconElement", {}, () => [
        vue.createVNode(_component_a_icon_hover, null, {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "closeIcon", {}, () => [
              vue.createVNode(_component_icon_close)
            ])
          ]),
          _: 3
        })
      ])
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 2);
}
var Notification = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = Notification;
