import _sfc_main from "./preview.vue_vue_type_script_lang.js";
import { resolveComponent, openBlock, createBlock, Teleport, createElementVNode, normalizeClass, normalizeStyle, createVNode, Transition, withCtx, withDirectives, vShow, createElementBlock, withModifiers, createCommentVNode, toDisplayString, renderSlot, normalizeProps, mergeProps } from "vue";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _hoisted_1 = ["src"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconLoading = resolveComponent("IconLoading");
  const _component_PreviewToolbar = resolveComponent("PreviewToolbar");
  const _component_IconClose = resolveComponent("IconClose");
  const _component_PreviewArrow = resolveComponent("PreviewArrow");
  return openBlock(), createBlock(Teleport, {
    to: _ctx.container,
    disabled: !_ctx.renderToBody
  }, [
    createElementVNode("div", {
      class: normalizeClass(_ctx.classNames),
      style: normalizeStyle(_ctx.wrapperStyles)
    }, [
      createVNode(Transition, {
        name: "image-fade",
        onBeforeEnter: _cache[0] || (_cache[0] = (el) => el.parentElement && (el.parentElement.style.display = "block")),
        onAfterLeave: _cache[1] || (_cache[1] = (el) => el.parentElement && (el.parentElement.style.display = "")),
        persisted: ""
      }, {
        default: withCtx(() => [
          withDirectives(createElementVNode("div", {
            class: normalizeClass(`${_ctx.prefixCls}-mask`)
          }, null, 2), [
            [vShow, _ctx.mergedVisible]
          ])
        ]),
        _: 1
      }),
      _ctx.mergedVisible ? (openBlock(), createElementBlock("div", {
        key: 0,
        ref: "refWrapper",
        tabindex: "0",
        class: normalizeClass(`${_ctx.prefixCls}-wrapper`),
        onClick: _cache[6] || (_cache[6] = (...args) => _ctx.onMaskClick && _ctx.onMaskClick(...args)),
        onWheel: _cache[7] || (_cache[7] = withModifiers((...args) => _ctx.onWheel && _ctx.onWheel(...args), ["prevent", "stop"]))
      }, [
        createCommentVNode(" img "),
        createElementVNode("div", {
          class: normalizeClass(`${_ctx.prefixCls}-img-container`),
          style: normalizeStyle({ transform: `scale(${_ctx.scale}, ${_ctx.scale})` }),
          onClick: _cache[4] || (_cache[4] = (...args) => _ctx.onMaskClick && _ctx.onMaskClick(...args))
        }, [
          (openBlock(), createElementBlock("img", {
            ref: "refImage",
            key: _ctx.src,
            src: _ctx.src,
            class: normalizeClass([
              `${_ctx.prefixCls}-img`,
              {
                [`${_ctx.prefixCls}-img-moving`]: _ctx.moving
              }
            ]),
            style: normalizeStyle({
              transform: `translate(${_ctx.translate[0]}px, ${_ctx.translate[1]}px) rotate(${_ctx.rotate}deg)`
            }),
            onLoad: _cache[2] || (_cache[2] = (...args) => _ctx.onImgLoad && _ctx.onImgLoad(...args)),
            onError: _cache[3] || (_cache[3] = (...args) => _ctx.onImgError && _ctx.onImgError(...args))
          }, null, 46, _hoisted_1))
        ], 6),
        createCommentVNode(" loading "),
        _ctx.isLoading ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(`${_ctx.prefixCls}-loading`)
        }, [
          createVNode(_component_IconLoading)
        ], 2)) : createCommentVNode("v-if", true),
        createCommentVNode(" scale value "),
        createVNode(Transition, { name: "image-fade" }, {
          default: withCtx(() => [
            _ctx.scaleValueVisible ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: normalizeClass(`${_ctx.prefixCls}-scale-value`)
            }, toDisplayString((_ctx.scale * 100).toFixed(0)) + "% ", 3)) : createCommentVNode("v-if", true)
          ]),
          _: 1
        }),
        createCommentVNode(" toolbar "),
        _ctx.isLoaded && _ctx.actionsLayout.length ? (openBlock(), createBlock(_component_PreviewToolbar, {
          key: 1,
          actions: _ctx.actions,
          "actions-layout": _ctx.actionsLayout
        }, {
          default: withCtx(() => [
            renderSlot(_ctx.$slots, "actions")
          ]),
          _: 3
        }, 8, ["actions", "actions-layout"])) : createCommentVNode("v-if", true),
        createCommentVNode(" close btn "),
        _ctx.closable ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: normalizeClass(`${_ctx.prefixCls}-close-btn`),
          onClick: _cache[5] || (_cache[5] = (...args) => _ctx.onCloseClick && _ctx.onCloseClick(...args))
        }, [
          createVNode(_component_IconClose)
        ], 2)) : createCommentVNode("v-if", true),
        createCommentVNode(" group arrow "),
        _ctx.inGroup ? (openBlock(), createBlock(_component_PreviewArrow, normalizeProps(mergeProps({ key: 3 }, _ctx.groupArrowProps)), null, 16)) : createCommentVNode("v-if", true)
      ], 34)) : createCommentVNode("v-if", true)
    ], 6)
  ], 8, ["to", "disabled"]);
}
var ImagePreview = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { ImagePreview as default };
