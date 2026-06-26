"use strict";
var preview_vue_vue_type_script_lang = require("./preview.vue_vue_type_script_lang.js");
var vue = require("vue");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _hoisted_1 = ["src"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconLoading = vue.resolveComponent("IconLoading");
  const _component_PreviewToolbar = vue.resolveComponent("PreviewToolbar");
  const _component_IconClose = vue.resolveComponent("IconClose");
  const _component_PreviewArrow = vue.resolveComponent("PreviewArrow");
  return vue.openBlock(), vue.createBlock(vue.Teleport, {
    to: _ctx.container,
    disabled: !_ctx.renderToBody
  }, [
    vue.createElementVNode("div", {
      class: vue.normalizeClass(_ctx.classNames),
      style: vue.normalizeStyle(_ctx.wrapperStyles)
    }, [
      vue.createVNode(vue.Transition, {
        name: "image-fade",
        onBeforeEnter: _cache[0] || (_cache[0] = (el) => el.parentElement && (el.parentElement.style.display = "block")),
        onAfterLeave: _cache[1] || (_cache[1] = (el) => el.parentElement && (el.parentElement.style.display = "")),
        persisted: ""
      }, {
        default: vue.withCtx(() => [
          vue.withDirectives(vue.createElementVNode("div", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-mask`)
          }, null, 2), [
            [vue.vShow, _ctx.mergedVisible]
          ])
        ]),
        _: 1
      }),
      _ctx.mergedVisible ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        ref: "refWrapper",
        tabindex: "0",
        class: vue.normalizeClass(`${_ctx.prefixCls}-wrapper`),
        onClick: _cache[6] || (_cache[6] = (...args) => _ctx.onMaskClick && _ctx.onMaskClick(...args)),
        onWheel: _cache[7] || (_cache[7] = vue.withModifiers((...args) => _ctx.onWheel && _ctx.onWheel(...args), ["prevent", "stop"]))
      }, [
        vue.createCommentVNode(" img "),
        vue.createElementVNode("div", {
          class: vue.normalizeClass(`${_ctx.prefixCls}-img-container`),
          style: vue.normalizeStyle({ transform: `scale(${_ctx.scale}, ${_ctx.scale})` }),
          onClick: _cache[4] || (_cache[4] = (...args) => _ctx.onMaskClick && _ctx.onMaskClick(...args))
        }, [
          (vue.openBlock(), vue.createElementBlock("img", {
            ref: "refImage",
            key: _ctx.src,
            src: _ctx.src,
            class: vue.normalizeClass([
              `${_ctx.prefixCls}-img`,
              {
                [`${_ctx.prefixCls}-img-moving`]: _ctx.moving
              }
            ]),
            style: vue.normalizeStyle({
              transform: `translate(${_ctx.translate[0]}px, ${_ctx.translate[1]}px) rotate(${_ctx.rotate}deg)`
            }),
            onLoad: _cache[2] || (_cache[2] = (...args) => _ctx.onImgLoad && _ctx.onImgLoad(...args)),
            onError: _cache[3] || (_cache[3] = (...args) => _ctx.onImgError && _ctx.onImgError(...args))
          }, null, 46, _hoisted_1))
        ], 6),
        vue.createCommentVNode(" loading "),
        _ctx.isLoading ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(`${_ctx.prefixCls}-loading`)
        }, [
          vue.createVNode(_component_IconLoading)
        ], 2)) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" scale value "),
        vue.createVNode(vue.Transition, { name: "image-fade" }, {
          default: vue.withCtx(() => [
            _ctx.scaleValueVisible ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: vue.normalizeClass(`${_ctx.prefixCls}-scale-value`)
            }, vue.toDisplayString((_ctx.scale * 100).toFixed(0)) + "% ", 3)) : vue.createCommentVNode("v-if", true)
          ]),
          _: 1
        }),
        vue.createCommentVNode(" toolbar "),
        _ctx.isLoaded && _ctx.actionsLayout.length ? (vue.openBlock(), vue.createBlock(_component_PreviewToolbar, {
          key: 1,
          actions: _ctx.actions,
          "actions-layout": _ctx.actionsLayout
        }, {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "actions")
          ]),
          _: 3
        }, 8, ["actions", "actions-layout"])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" close btn "),
        _ctx.closable ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 2,
          class: vue.normalizeClass(`${_ctx.prefixCls}-close-btn`),
          onClick: _cache[5] || (_cache[5] = (...args) => _ctx.onCloseClick && _ctx.onCloseClick(...args))
        }, [
          vue.createVNode(_component_IconClose)
        ], 2)) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" group arrow "),
        _ctx.inGroup ? (vue.openBlock(), vue.createBlock(_component_PreviewArrow, vue.normalizeProps(vue.mergeProps({ key: 3 }, _ctx.groupArrowProps)), null, 16)) : vue.createCommentVNode("v-if", true)
      ], 34)) : vue.createCommentVNode("v-if", true)
    ], 6)
  ], 8, ["to", "disabled"]);
}
var ImagePreview = /* @__PURE__ */ pluginVue_exportHelper(preview_vue_vue_type_script_lang, [["render", _sfc_render]]);
module.exports = ImagePreview;
