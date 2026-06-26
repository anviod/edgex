"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var iconHover = require("../_components/icon-hover.js");
var index = require("../icon/icon-close/index.js");
var index$1 = require("../icon/icon-info-circle-fill/index.js");
var index$2 = require("../icon/icon-check-circle-fill/index.js");
var index$3 = require("../icon/icon-exclamation-circle-fill/index.js");
var index$4 = require("../icon/icon-close-circle-fill/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Alert",
  components: {
    IconHover: iconHover,
    IconClose: index,
    IconInfoCircleFill: index$1,
    IconCheckCircleFill: index$2,
    IconExclamationCircleFill: index$3,
    IconCloseCircleFill: index$4
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
    const prefixCls = globalConfig.getPrefixCls("alert");
    const visible = vue.ref(true);
    const handleClose = (ev) => {
      visible.value = false;
      emit("close", ev);
    };
    const handleAfterLeave = () => {
      emit("afterClose");
    };
    const cls = vue.computed(() => [
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
  const _component_icon_info_circle_fill = vue.resolveComponent("icon-info-circle-fill");
  const _component_icon_check_circle_fill = vue.resolveComponent("icon-check-circle-fill");
  const _component_icon_exclamation_circle_fill = vue.resolveComponent("icon-exclamation-circle-fill");
  const _component_icon_close_circle_fill = vue.resolveComponent("icon-close-circle-fill");
  const _component_icon_close = vue.resolveComponent("icon-close");
  const _component_icon_hover = vue.resolveComponent("icon-hover");
  return vue.openBlock(), vue.createBlock(vue.Transition, {
    name: "zoom-in-top",
    onAfterLeave: _ctx.handleAfterLeave
  }, {
    default: vue.withCtx(() => [
      _ctx.visible ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        role: "alert",
        class: vue.normalizeClass(_ctx.cls)
      }, [
        _ctx.showIcon && !(_ctx.type === "normal" && !_ctx.$slots.icon) ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(`${_ctx.prefixCls}-icon`)
        }, [
          vue.renderSlot(_ctx.$slots, "icon", {}, () => [
            _ctx.type === "info" ? (vue.openBlock(), vue.createBlock(_component_icon_info_circle_fill, { key: 0 })) : _ctx.type === "success" ? (vue.openBlock(), vue.createBlock(_component_icon_check_circle_fill, { key: 1 })) : _ctx.type === "warning" ? (vue.openBlock(), vue.createBlock(_component_icon_exclamation_circle_fill, { key: 2 })) : _ctx.type === "error" ? (vue.openBlock(), vue.createBlock(_component_icon_close_circle_fill, { key: 3 })) : vue.createCommentVNode("v-if", true)
          ])
        ], 2)) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("div", {
          class: vue.normalizeClass(`${_ctx.prefixCls}-body`)
        }, [
          _ctx.title || _ctx.$slots.title ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(`${_ctx.prefixCls}-title`)
          }, [
            vue.renderSlot(_ctx.$slots, "title", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
            ])
          ], 2)) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("div", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-content`)
          }, [
            vue.renderSlot(_ctx.$slots, "default")
          ], 2)
        ], 2),
        _ctx.$slots.action ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          class: vue.normalizeClass(`${_ctx.prefixCls}-action`)
        }, [
          vue.renderSlot(_ctx.$slots, "action")
        ], 2)) : vue.createCommentVNode("v-if", true),
        _ctx.closable ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 2,
          tabindex: "-1",
          role: "button",
          "aria-label": "Close",
          class: vue.normalizeClass(`${_ctx.prefixCls}-close-btn`),
          onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClose && _ctx.handleClose(...args))
        }, [
          vue.renderSlot(_ctx.$slots, "close-element", {}, () => [
            vue.createVNode(_component_icon_hover, null, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_icon_close)
              ]),
              _: 1
            })
          ])
        ], 2)) : vue.createCommentVNode("v-if", true)
      ], 2)) : vue.createCommentVNode("v-if", true)
    ]),
    _: 3
  }, 8, ["onAfterLeave"]);
}
var _Alert = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Alert;
