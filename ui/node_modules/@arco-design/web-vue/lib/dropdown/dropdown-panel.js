"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index$1 = require("../empty/index.js");
var context = require("./context.js");
var is = require("../_utils/is.js");
var index = require("../scrollbar/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "DropdownPanel",
  components: {
    Scrollbar: index,
    Empty: index$1
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    bottomOffset: {
      type: Number,
      default: 0
    },
    onScroll: {
      type: [Function, Array]
    },
    onReachBottom: {
      type: [Function, Array]
    }
  },
  emits: ["scroll", "reachBottom"],
  setup(props, { emit, slots }) {
    const prefixCls = globalConfig.getPrefixCls("dropdown");
    const dropdownCtx = vue.inject(
      context.dropdownInjectionKey,
      {}
    );
    const wrapperRef = vue.ref();
    const handleScroll = (e) => {
      const { scrollTop, scrollHeight, offsetHeight } = e.target;
      const bottom = scrollHeight - (scrollTop + offsetHeight);
      if (bottom <= props.bottomOffset) {
        emit("reachBottom", e);
      }
      emit("scroll", e);
    };
    const style = vue.computed(() => {
      if (is.isNumber(dropdownCtx.popupMaxHeight)) {
        return {
          maxHeight: `${dropdownCtx.popupMaxHeight}px`
        };
      }
      if (!dropdownCtx.popupMaxHeight) {
        return {
          maxHeight: "none",
          overflowY: "hidden"
        };
      }
      return void 0;
    });
    const cls = vue.computed(() => [
      prefixCls,
      {
        [`${prefixCls}-has-footer`]: Boolean(slots.footer)
      }
    ]);
    return {
      prefixCls,
      cls,
      style,
      wrapperRef,
      handleScroll
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_empty = vue.resolveComponent("empty");
  const _component_Scrollbar = vue.resolveComponent("Scrollbar");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.cls)
  }, [
    _ctx.isEmpty ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-empty`)
    }, [
      vue.renderSlot(_ctx.$slots, "empty", {}, () => [
        vue.createVNode(_component_empty)
      ])
    ], 2)) : vue.createCommentVNode("v-if", true),
    vue.createVNode(_component_Scrollbar, {
      ref: "wrapperRef",
      class: vue.normalizeClass(`${_ctx.prefixCls}-list-wrapper`),
      style: vue.normalizeStyle(_ctx.style),
      onScroll: _ctx.handleScroll
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("ul", {
          class: vue.normalizeClass(`${_ctx.prefixCls}-list`)
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 2)
      ]),
      _: 3
    }, 8, ["class", "style", "onScroll"]),
    _ctx.$slots.footer && !_ctx.isEmpty ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 1,
      class: vue.normalizeClass(`${_ctx.prefixCls}-footer`)
    }, [
      vue.renderSlot(_ctx.$slots, "footer")
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 2);
}
var DropdownPanel = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = DropdownPanel;
