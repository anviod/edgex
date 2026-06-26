import _sfc_main from "./modal.vue_vue_type_script_lang.js";
import { resolveComponent, openBlock, createBlock, withCtx, Teleport, withDirectives, createElementBlock, mergeProps, createVNode, Transition, normalizeClass, normalizeStyle, vShow, createCommentVNode, createElementVNode, withModifiers, renderSlot, createTextVNode, toDisplayString } from "vue";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_info_circle_fill = resolveComponent("icon-info-circle-fill");
  const _component_icon_check_circle_fill = resolveComponent("icon-check-circle-fill");
  const _component_icon_exclamation_circle_fill = resolveComponent("icon-exclamation-circle-fill");
  const _component_icon_close_circle_fill = resolveComponent("icon-close-circle-fill");
  const _component_icon_close = resolveComponent("icon-close");
  const _component_icon_hover = resolveComponent("icon-hover");
  const _component_arco_button = resolveComponent("arco-button");
  const _component_client_only = resolveComponent("client-only");
  return openBlock(), createBlock(_component_client_only, null, {
    default: withCtx(() => [
      (openBlock(), createBlock(Teleport, {
        to: _ctx.teleportContainer,
        disabled: !_ctx.renderToBody
      }, [
        !_ctx.unmountOnClose || _ctx.computedVisible || _ctx.mounted ? withDirectives((openBlock(), createElementBlock("div", mergeProps({
          key: 0,
          class: `${_ctx.prefixCls}-container`,
          style: { zIndex: _ctx.zIndex }
        }, _ctx.$attrs), [
          createVNode(Transition, {
            name: _ctx.maskAnimationName,
            appear: ""
          }, {
            default: withCtx(() => [
              _ctx.mask ? withDirectives((openBlock(), createElementBlock("div", {
                key: 0,
                ref: "maskRef",
                class: normalizeClass(`${_ctx.prefixCls}-mask`),
                style: normalizeStyle(_ctx.maskStyle)
              }, null, 6)), [
                [vShow, _ctx.computedVisible]
              ]) : createCommentVNode("v-if", true)
            ]),
            _: 1
          }, 8, ["name"]),
          createElementVNode("div", {
            ref: "wrapperRef",
            class: normalizeClass(_ctx.wrapperCls),
            onClick: _cache[2] || (_cache[2] = withModifiers((...args) => _ctx.handleMaskClick && _ctx.handleMaskClick(...args), ["self"])),
            onMousedown: _cache[3] || (_cache[3] = withModifiers((...args) => _ctx.handleMaskMouseDown && _ctx.handleMaskMouseDown(...args), ["self"]))
          }, [
            createVNode(Transition, {
              name: _ctx.modalAnimationName,
              appear: "",
              onAfterEnter: _ctx.handleOpen,
              onAfterLeave: _ctx.handleClose,
              persisted: ""
            }, {
              default: withCtx(() => [
                withDirectives(createElementVNode("div", {
                  ref: "modalRef",
                  class: normalizeClass(_ctx.modalCls),
                  style: normalizeStyle(_ctx.mergedModalStyle)
                }, [
                  !_ctx.hideTitle && (_ctx.$slots.title || _ctx.title || _ctx.closable) ? (openBlock(), createElementBlock("div", {
                    key: 0,
                    class: normalizeClass(`${_ctx.prefixCls}-header`),
                    onMousedown: _cache[1] || (_cache[1] = (...args) => _ctx.handleMoveDown && _ctx.handleMoveDown(...args))
                  }, [
                    _ctx.$slots.title || _ctx.title ? (openBlock(), createElementBlock("div", {
                      key: 0,
                      class: normalizeClass([
                        `${_ctx.prefixCls}-title`,
                        `${_ctx.prefixCls}-title-align-${_ctx.titleAlign}`
                      ])
                    }, [
                      _ctx.messageType ? (openBlock(), createElementBlock("div", {
                        key: 0,
                        class: normalizeClass(`${_ctx.prefixCls}-title-icon`)
                      }, [
                        _ctx.messageType === "info" ? (openBlock(), createBlock(_component_icon_info_circle_fill, { key: 0 })) : createCommentVNode("v-if", true),
                        _ctx.messageType === "success" ? (openBlock(), createBlock(_component_icon_check_circle_fill, { key: 1 })) : createCommentVNode("v-if", true),
                        _ctx.messageType === "warning" ? (openBlock(), createBlock(_component_icon_exclamation_circle_fill, { key: 2 })) : createCommentVNode("v-if", true),
                        _ctx.messageType === "error" ? (openBlock(), createBlock(_component_icon_close_circle_fill, { key: 3 })) : createCommentVNode("v-if", true)
                      ], 2)) : createCommentVNode("v-if", true),
                      renderSlot(_ctx.$slots, "title", {}, () => [
                        createTextVNode(toDisplayString(_ctx.title), 1)
                      ])
                    ], 2)) : createCommentVNode("v-if", true),
                    !_ctx.simple && _ctx.closable ? (openBlock(), createElementBlock("div", {
                      key: 1,
                      tabindex: "-1",
                      role: "button",
                      "aria-label": "Close",
                      class: normalizeClass(`${_ctx.prefixCls}-close-btn`),
                      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleCancel && _ctx.handleCancel(...args))
                    }, [
                      createVNode(_component_icon_hover, null, {
                        default: withCtx(() => [
                          createVNode(_component_icon_close)
                        ]),
                        _: 1
                      })
                    ], 2)) : createCommentVNode("v-if", true)
                  ], 34)) : createCommentVNode("v-if", true),
                  createElementVNode("div", {
                    class: normalizeClass([`${_ctx.prefixCls}-body`, _ctx.bodyClass]),
                    style: normalizeStyle(_ctx.bodyStyle)
                  }, [
                    renderSlot(_ctx.$slots, "default")
                  ], 6),
                  _ctx.footer ? (openBlock(), createElementBlock("div", {
                    key: 1,
                    class: normalizeClass(`${_ctx.prefixCls}-footer`)
                  }, [
                    renderSlot(_ctx.$slots, "footer", {}, () => [
                      !_ctx.hideCancel ? (openBlock(), createBlock(_component_arco_button, mergeProps({ key: 0 }, _ctx.cancelButtonProps, { onClick: _ctx.handleCancel }), {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(_ctx.cancelDisplayText), 1)
                        ]),
                        _: 1
                      }, 16, ["onClick"])) : createCommentVNode("v-if", true),
                      createVNode(_component_arco_button, mergeProps({ type: "primary" }, _ctx.okButtonProps, {
                        loading: _ctx.mergedOkLoading,
                        onClick: _ctx.handleOk
                      }), {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(_ctx.okDisplayText), 1)
                        ]),
                        _: 1
                      }, 16, ["loading", "onClick"])
                    ])
                  ], 2)) : createCommentVNode("v-if", true)
                ], 6), [
                  [vShow, _ctx.computedVisible]
                ])
              ]),
              _: 3
            }, 8, ["name", "onAfterEnter", "onAfterLeave"])
          ], 34)
        ], 16)), [
          [vShow, _ctx.computedVisible || _ctx.mounted]
        ]) : createCommentVNode("v-if", true)
      ], 8, ["to", "disabled"]))
    ]),
    _: 3
  });
}
var _Modal = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Modal as default };
