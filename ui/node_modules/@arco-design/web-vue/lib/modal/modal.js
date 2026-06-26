"use strict";
var modal_vue_vue_type_script_lang = require("./modal.vue_vue_type_script_lang.js");
var vue = require("vue");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_info_circle_fill = vue.resolveComponent("icon-info-circle-fill");
  const _component_icon_check_circle_fill = vue.resolveComponent("icon-check-circle-fill");
  const _component_icon_exclamation_circle_fill = vue.resolveComponent("icon-exclamation-circle-fill");
  const _component_icon_close_circle_fill = vue.resolveComponent("icon-close-circle-fill");
  const _component_icon_close = vue.resolveComponent("icon-close");
  const _component_icon_hover = vue.resolveComponent("icon-hover");
  const _component_arco_button = vue.resolveComponent("arco-button");
  const _component_client_only = vue.resolveComponent("client-only");
  return vue.openBlock(), vue.createBlock(_component_client_only, null, {
    default: vue.withCtx(() => [
      (vue.openBlock(), vue.createBlock(vue.Teleport, {
        to: _ctx.teleportContainer,
        disabled: !_ctx.renderToBody
      }, [
        !_ctx.unmountOnClose || _ctx.computedVisible || _ctx.mounted ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({
          key: 0,
          class: `${_ctx.prefixCls}-container`,
          style: { zIndex: _ctx.zIndex }
        }, _ctx.$attrs), [
          vue.createVNode(vue.Transition, {
            name: _ctx.maskAnimationName,
            appear: ""
          }, {
            default: vue.withCtx(() => [
              _ctx.mask ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                ref: "maskRef",
                class: vue.normalizeClass(`${_ctx.prefixCls}-mask`),
                style: vue.normalizeStyle(_ctx.maskStyle)
              }, null, 6)), [
                [vue.vShow, _ctx.computedVisible]
              ]) : vue.createCommentVNode("v-if", true)
            ]),
            _: 1
          }, 8, ["name"]),
          vue.createElementVNode("div", {
            ref: "wrapperRef",
            class: vue.normalizeClass(_ctx.wrapperCls),
            onClick: _cache[2] || (_cache[2] = vue.withModifiers((...args) => _ctx.handleMaskClick && _ctx.handleMaskClick(...args), ["self"])),
            onMousedown: _cache[3] || (_cache[3] = vue.withModifiers((...args) => _ctx.handleMaskMouseDown && _ctx.handleMaskMouseDown(...args), ["self"]))
          }, [
            vue.createVNode(vue.Transition, {
              name: _ctx.modalAnimationName,
              appear: "",
              onAfterEnter: _ctx.handleOpen,
              onAfterLeave: _ctx.handleClose,
              persisted: ""
            }, {
              default: vue.withCtx(() => [
                vue.withDirectives(vue.createElementVNode("div", {
                  ref: "modalRef",
                  class: vue.normalizeClass(_ctx.modalCls),
                  style: vue.normalizeStyle(_ctx.mergedModalStyle)
                }, [
                  !_ctx.hideTitle && (_ctx.$slots.title || _ctx.title || _ctx.closable) ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 0,
                    class: vue.normalizeClass(`${_ctx.prefixCls}-header`),
                    onMousedown: _cache[1] || (_cache[1] = (...args) => _ctx.handleMoveDown && _ctx.handleMoveDown(...args))
                  }, [
                    _ctx.$slots.title || _ctx.title ? (vue.openBlock(), vue.createElementBlock("div", {
                      key: 0,
                      class: vue.normalizeClass([
                        `${_ctx.prefixCls}-title`,
                        `${_ctx.prefixCls}-title-align-${_ctx.titleAlign}`
                      ])
                    }, [
                      _ctx.messageType ? (vue.openBlock(), vue.createElementBlock("div", {
                        key: 0,
                        class: vue.normalizeClass(`${_ctx.prefixCls}-title-icon`)
                      }, [
                        _ctx.messageType === "info" ? (vue.openBlock(), vue.createBlock(_component_icon_info_circle_fill, { key: 0 })) : vue.createCommentVNode("v-if", true),
                        _ctx.messageType === "success" ? (vue.openBlock(), vue.createBlock(_component_icon_check_circle_fill, { key: 1 })) : vue.createCommentVNode("v-if", true),
                        _ctx.messageType === "warning" ? (vue.openBlock(), vue.createBlock(_component_icon_exclamation_circle_fill, { key: 2 })) : vue.createCommentVNode("v-if", true),
                        _ctx.messageType === "error" ? (vue.openBlock(), vue.createBlock(_component_icon_close_circle_fill, { key: 3 })) : vue.createCommentVNode("v-if", true)
                      ], 2)) : vue.createCommentVNode("v-if", true),
                      vue.renderSlot(_ctx.$slots, "title", {}, () => [
                        vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
                      ])
                    ], 2)) : vue.createCommentVNode("v-if", true),
                    !_ctx.simple && _ctx.closable ? (vue.openBlock(), vue.createElementBlock("div", {
                      key: 1,
                      tabindex: "-1",
                      role: "button",
                      "aria-label": "Close",
                      class: vue.normalizeClass(`${_ctx.prefixCls}-close-btn`),
                      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleCancel && _ctx.handleCancel(...args))
                    }, [
                      vue.createVNode(_component_icon_hover, null, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_icon_close)
                        ]),
                        _: 1
                      })
                    ], 2)) : vue.createCommentVNode("v-if", true)
                  ], 34)) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass([`${_ctx.prefixCls}-body`, _ctx.bodyClass]),
                    style: vue.normalizeStyle(_ctx.bodyStyle)
                  }, [
                    vue.renderSlot(_ctx.$slots, "default")
                  ], 6),
                  _ctx.footer ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 1,
                    class: vue.normalizeClass(`${_ctx.prefixCls}-footer`)
                  }, [
                    vue.renderSlot(_ctx.$slots, "footer", {}, () => [
                      !_ctx.hideCancel ? (vue.openBlock(), vue.createBlock(_component_arco_button, vue.mergeProps({ key: 0 }, _ctx.cancelButtonProps, { onClick: _ctx.handleCancel }), {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(_ctx.cancelDisplayText), 1)
                        ]),
                        _: 1
                      }, 16, ["onClick"])) : vue.createCommentVNode("v-if", true),
                      vue.createVNode(_component_arco_button, vue.mergeProps({ type: "primary" }, _ctx.okButtonProps, {
                        loading: _ctx.mergedOkLoading,
                        onClick: _ctx.handleOk
                      }), {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(_ctx.okDisplayText), 1)
                        ]),
                        _: 1
                      }, 16, ["loading", "onClick"])
                    ])
                  ], 2)) : vue.createCommentVNode("v-if", true)
                ], 6), [
                  [vue.vShow, _ctx.computedVisible]
                ])
              ]),
              _: 3
            }, 8, ["name", "onAfterEnter", "onAfterLeave"])
          ], 34)
        ], 16)), [
          [vue.vShow, _ctx.computedVisible || _ctx.mounted]
        ]) : vue.createCommentVNode("v-if", true)
      ], 8, ["to", "disabled"]))
    ]),
    _: 3
  });
}
var _Modal = /* @__PURE__ */ pluginVue_exportHelper(modal_vue_vue_type_script_lang, [["render", _sfc_render]]);
module.exports = _Modal;
