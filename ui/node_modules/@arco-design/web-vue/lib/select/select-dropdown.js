"use strict";
var vue = require("vue");
var context = require("../config-provider/context.js");
var globalConfig = require("../_utils/global-config.js");
var index$1 = require("../empty/index.js");
var index$2 = require("../spin/index.js");
var index = require("../scrollbar/index.js");
var useComponentRef = require("../_hooks/use-component-ref.js");
var useScrollbar = require("../_hooks/use-scrollbar.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "SelectDropdown",
  components: {
    ScrollbarComponent: index,
    Empty: index$1,
    Spin: index$2
  },
  props: {
    loading: Boolean,
    empty: Boolean,
    virtualList: Boolean,
    bottomOffset: {
      type: Number,
      default: 0
    },
    scrollbar: {
      type: [Boolean, Object],
      default: true
    },
    onScroll: {
      type: [Function, Array]
    },
    onReachBottom: {
      type: [Function, Array]
    },
    showHeaderOnEmpty: {
      type: Boolean,
      default: false
    },
    showFooterOnEmpty: {
      type: Boolean,
      default: false
    }
  },
  emits: ["scroll", "reachBottom"],
  setup(props, { emit, slots }) {
    var _a, _b, _c;
    const { scrollbar } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("select-dropdown");
    const configCtx = vue.inject(context.configProviderInjectionKey, void 0);
    const SelectEmpty = (_c = (_b = configCtx == null ? void 0 : (_a = configCtx.slots).empty) == null ? void 0 : _b.call(_a, { component: "select" })) == null ? void 0 : _c[0];
    const { componentRef: wrapperComRef, elementRef: wrapperRef } = useComponentRef.useComponentRef("containerRef");
    const { displayScrollbar, scrollbarProps } = useScrollbar.useScrollbar(scrollbar);
    const handleScroll = (e) => {
      const { scrollTop, scrollHeight, offsetHeight } = e.target;
      const bottom = scrollHeight - (scrollTop + offsetHeight);
      if (bottom <= props.bottomOffset) {
        emit("reachBottom", e);
      }
      emit("scroll", e);
    };
    const cls = vue.computed(() => [
      prefixCls,
      {
        [`${prefixCls}-has-header`]: Boolean(slots.header),
        [`${prefixCls}-has-footer`]: Boolean(slots.footer)
      }
    ]);
    return {
      prefixCls,
      SelectEmpty,
      cls,
      wrapperRef,
      wrapperComRef,
      handleScroll,
      displayScrollbar,
      scrollbarProps
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_spin = vue.resolveComponent("spin");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.cls)
  }, [
    _ctx.$slots.header && (!_ctx.empty || _ctx.showHeaderOnEmpty) ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-header`)
    }, [
      vue.renderSlot(_ctx.$slots, "header")
    ], 2)) : vue.createCommentVNode("v-if", true),
    _ctx.loading ? (vue.openBlock(), vue.createBlock(_component_spin, {
      key: 1,
      class: vue.normalizeClass(`${_ctx.prefixCls}-loading`)
    }, null, 8, ["class"])) : _ctx.empty ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 2,
      class: vue.normalizeClass(`${_ctx.prefixCls}-empty`)
    }, [
      vue.renderSlot(_ctx.$slots, "empty", {}, () => [
        (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.SelectEmpty ? _ctx.SelectEmpty : "Empty")))
      ])
    ], 2)) : vue.createCommentVNode("v-if", true),
    _ctx.virtualList && !_ctx.loading && !_ctx.empty ? vue.renderSlot(_ctx.$slots, "virtual-list", { key: 3 }) : vue.createCommentVNode("v-if", true),
    !_ctx.virtualList ? vue.withDirectives((vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.displayScrollbar ? "ScrollbarComponent" : "div"), vue.mergeProps({
      key: 4,
      ref: "wrapperComRef",
      class: `${_ctx.prefixCls}-list-wrapper`
    }, _ctx.scrollbarProps, { onScroll: _ctx.handleScroll }), {
      default: vue.withCtx(() => [
        vue.createElementVNode("ul", {
          class: vue.normalizeClass(`${_ctx.prefixCls}-list`)
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 2)
      ]),
      _: 3
    }, 16, ["class", "onScroll"])), [
      [vue.vShow, !_ctx.loading && !_ctx.empty]
    ]) : vue.createCommentVNode("v-if", true),
    _ctx.$slots.footer && (!_ctx.empty || _ctx.showFooterOnEmpty) ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 5,
      class: vue.normalizeClass(`${_ctx.prefixCls}-footer`)
    }, [
      vue.renderSlot(_ctx.$slots, "footer")
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 2);
}
var SelectDropdown = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = SelectDropdown;
