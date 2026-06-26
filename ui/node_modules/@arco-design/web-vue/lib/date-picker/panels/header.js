"use strict";
var vue = require("vue");
var is = require("../../_utils/is.js");
var index = require("../../icon/icon-left/index.js");
var index$1 = require("../../icon/icon-right/index.js");
var index$2 = require("../../icon/icon-double-left/index.js");
var index$3 = require("../../icon/icon-double-right/index.js");
var renderFunction = require("../../_components/render-function.js");
var pluginVue_exportHelper = require("../../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "PanelHeader",
  components: {
    IconLeft: index,
    IconRight: index$1,
    IconDoubleLeft: index$2,
    IconDoubleRight: index$3,
    RenderFunction: renderFunction
  },
  props: {
    prefixCls: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      default: "date"
    },
    value: {
      type: Object
    },
    icons: {
      type: Object
    },
    onPrev: {
      type: Function
    },
    onSuperPrev: {
      type: Function
    },
    onNext: {
      type: Function
    },
    onSuperNext: {
      type: Function
    },
    onLabelClick: {
      type: Function
    }
  },
  emits: ["label-click"],
  setup(props) {
    return {
      showPrev: vue.computed(() => is.isFunction(props.onPrev)),
      showSuperPrev: vue.computed(() => is.isFunction(props.onSuperPrev)),
      showNext: vue.computed(() => is.isFunction(props.onNext)),
      showSuperNext: vue.computed(() => is.isFunction(props.onSuperNext)),
      year: vue.computed(
        () => ["date", "quarter", "month", "week"].includes(props.mode) && props.value ? props.value.format("YYYY") : ""
      ),
      month: vue.computed(
        () => ["date", "week"].includes(props.mode) && props.value ? props.value.format("MM") : ""
      ),
      getIconClassName: (show) => [
        `${props.prefixCls}-header-icon`,
        {
          [`${props.prefixCls}-header-icon-hidden`]: !show
        }
      ]
    };
  }
});
const _hoisted_1 = { key: 1 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_RenderFunction = vue.resolveComponent("RenderFunction");
  const _component_IconDoubleLeft = vue.resolveComponent("IconDoubleLeft");
  const _component_IconLeft = vue.resolveComponent("IconLeft");
  const _component_IconRight = vue.resolveComponent("IconRight");
  const _component_IconDoubleRight = vue.resolveComponent("IconDoubleRight");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(`${_ctx.prefixCls}-header`)
  }, [
    vue.createElementVNode("div", {
      class: vue.normalizeClass(_ctx.getIconClassName(_ctx.showSuperPrev)),
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onSuperPrev && _ctx.onSuperPrev(...args))
    }, [
      _ctx.showSuperPrev ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
        _ctx.icons && _ctx.icons.prevDouble ? (vue.openBlock(), vue.createBlock(_component_RenderFunction, {
          key: 0,
          "render-func": _ctx.icons && _ctx.icons.prevDouble
        }, null, 8, ["render-func"])) : (vue.openBlock(), vue.createBlock(_component_IconDoubleLeft, { key: 1 }))
      ], 64)) : vue.createCommentVNode("v-if", true)
    ], 2),
    vue.createElementVNode("div", {
      class: vue.normalizeClass(_ctx.getIconClassName(_ctx.showPrev)),
      onClick: _cache[1] || (_cache[1] = (...args) => _ctx.onPrev && _ctx.onPrev(...args))
    }, [
      _ctx.showPrev ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
        _ctx.icons && _ctx.icons.prev ? (vue.openBlock(), vue.createBlock(_component_RenderFunction, {
          key: 0,
          "render-func": _ctx.icons && _ctx.icons.prev
        }, null, 8, ["render-func"])) : (vue.openBlock(), vue.createBlock(_component_IconLeft, { key: 1 }))
      ], 64)) : vue.createCommentVNode("v-if", true)
    ], 2),
    vue.createElementVNode("div", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-header-title`)
    }, [
      _ctx.onLabelClick && (_ctx.year || _ctx.month) ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
        _ctx.year ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass(`${_ctx.prefixCls}-header-label`),
          onClick: _cache[2] || (_cache[2] = () => _ctx.onLabelClick && _ctx.onLabelClick("year"))
        }, vue.toDisplayString(_ctx.year), 3)) : vue.createCommentVNode("v-if", true),
        _ctx.year && _ctx.month ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1, "-")) : vue.createCommentVNode("v-if", true),
        _ctx.month ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 2,
          class: vue.normalizeClass(`${_ctx.prefixCls}-header-label`),
          onClick: _cache[3] || (_cache[3] = () => _ctx.onLabelClick && _ctx.onLabelClick("month"))
        }, vue.toDisplayString(_ctx.month), 3)) : vue.createCommentVNode("v-if", true)
      ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
        vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
      ], 64))
    ], 2),
    vue.createElementVNode("div", {
      class: vue.normalizeClass(_ctx.getIconClassName(_ctx.showNext)),
      onClick: _cache[4] || (_cache[4] = (...args) => _ctx.onNext && _ctx.onNext(...args))
    }, [
      _ctx.showNext ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
        _ctx.icons && _ctx.icons.next ? (vue.openBlock(), vue.createBlock(_component_RenderFunction, {
          key: 0,
          "render-func": _ctx.icons && _ctx.icons.next
        }, null, 8, ["render-func"])) : (vue.openBlock(), vue.createBlock(_component_IconRight, { key: 1 }))
      ], 64)) : vue.createCommentVNode("v-if", true)
    ], 2),
    vue.createElementVNode("div", {
      class: vue.normalizeClass(_ctx.getIconClassName(_ctx.showSuperNext)),
      onClick: _cache[5] || (_cache[5] = (...args) => _ctx.onSuperNext && _ctx.onSuperNext(...args))
    }, [
      _ctx.showSuperNext ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
        _ctx.icons && _ctx.icons.nextDouble ? (vue.openBlock(), vue.createBlock(_component_RenderFunction, {
          key: 0,
          "render-func": _ctx.icons && _ctx.icons.nextDouble
        }, null, 8, ["render-func"])) : (vue.openBlock(), vue.createBlock(_component_IconDoubleRight, { key: 1 }))
      ], 64)) : vue.createCommentVNode("v-if", true)
    ], 2)
  ], 2);
}
var PanelHeader = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = PanelHeader;
