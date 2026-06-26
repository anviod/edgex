import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, Fragment, createBlock, createCommentVNode, toDisplayString, createTextVNode } from "vue";
import { isFunction } from "../../_utils/is.js";
import IconLeft from "../../icon/icon-left/index.js";
import IconRight from "../../icon/icon-right/index.js";
import IconDoubleLeft from "../../icon/icon-double-left/index.js";
import IconDoubleRight from "../../icon/icon-double-right/index.js";
import RenderFunction from "../../_components/render-function.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "PanelHeader",
  components: {
    IconLeft,
    IconRight,
    IconDoubleLeft,
    IconDoubleRight,
    RenderFunction
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
      showPrev: computed(() => isFunction(props.onPrev)),
      showSuperPrev: computed(() => isFunction(props.onSuperPrev)),
      showNext: computed(() => isFunction(props.onNext)),
      showSuperNext: computed(() => isFunction(props.onSuperNext)),
      year: computed(
        () => ["date", "quarter", "month", "week"].includes(props.mode) && props.value ? props.value.format("YYYY") : ""
      ),
      month: computed(
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
  const _component_RenderFunction = resolveComponent("RenderFunction");
  const _component_IconDoubleLeft = resolveComponent("IconDoubleLeft");
  const _component_IconLeft = resolveComponent("IconLeft");
  const _component_IconRight = resolveComponent("IconRight");
  const _component_IconDoubleRight = resolveComponent("IconDoubleRight");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(`${_ctx.prefixCls}-header`)
  }, [
    createElementVNode("div", {
      class: normalizeClass(_ctx.getIconClassName(_ctx.showSuperPrev)),
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onSuperPrev && _ctx.onSuperPrev(...args))
    }, [
      _ctx.showSuperPrev ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
        _ctx.icons && _ctx.icons.prevDouble ? (openBlock(), createBlock(_component_RenderFunction, {
          key: 0,
          "render-func": _ctx.icons && _ctx.icons.prevDouble
        }, null, 8, ["render-func"])) : (openBlock(), createBlock(_component_IconDoubleLeft, { key: 1 }))
      ], 64)) : createCommentVNode("v-if", true)
    ], 2),
    createElementVNode("div", {
      class: normalizeClass(_ctx.getIconClassName(_ctx.showPrev)),
      onClick: _cache[1] || (_cache[1] = (...args) => _ctx.onPrev && _ctx.onPrev(...args))
    }, [
      _ctx.showPrev ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
        _ctx.icons && _ctx.icons.prev ? (openBlock(), createBlock(_component_RenderFunction, {
          key: 0,
          "render-func": _ctx.icons && _ctx.icons.prev
        }, null, 8, ["render-func"])) : (openBlock(), createBlock(_component_IconLeft, { key: 1 }))
      ], 64)) : createCommentVNode("v-if", true)
    ], 2),
    createElementVNode("div", {
      class: normalizeClass(`${_ctx.prefixCls}-header-title`)
    }, [
      _ctx.onLabelClick && (_ctx.year || _ctx.month) ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
        _ctx.year ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(`${_ctx.prefixCls}-header-label`),
          onClick: _cache[2] || (_cache[2] = () => _ctx.onLabelClick && _ctx.onLabelClick("year"))
        }, toDisplayString(_ctx.year), 3)) : createCommentVNode("v-if", true),
        _ctx.year && _ctx.month ? (openBlock(), createElementBlock("span", _hoisted_1, "-")) : createCommentVNode("v-if", true),
        _ctx.month ? (openBlock(), createElementBlock("span", {
          key: 2,
          class: normalizeClass(`${_ctx.prefixCls}-header-label`),
          onClick: _cache[3] || (_cache[3] = () => _ctx.onLabelClick && _ctx.onLabelClick("month"))
        }, toDisplayString(_ctx.month), 3)) : createCommentVNode("v-if", true)
      ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
        createTextVNode(toDisplayString(_ctx.title), 1)
      ], 64))
    ], 2),
    createElementVNode("div", {
      class: normalizeClass(_ctx.getIconClassName(_ctx.showNext)),
      onClick: _cache[4] || (_cache[4] = (...args) => _ctx.onNext && _ctx.onNext(...args))
    }, [
      _ctx.showNext ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
        _ctx.icons && _ctx.icons.next ? (openBlock(), createBlock(_component_RenderFunction, {
          key: 0,
          "render-func": _ctx.icons && _ctx.icons.next
        }, null, 8, ["render-func"])) : (openBlock(), createBlock(_component_IconRight, { key: 1 }))
      ], 64)) : createCommentVNode("v-if", true)
    ], 2),
    createElementVNode("div", {
      class: normalizeClass(_ctx.getIconClassName(_ctx.showSuperNext)),
      onClick: _cache[5] || (_cache[5] = (...args) => _ctx.onSuperNext && _ctx.onSuperNext(...args))
    }, [
      _ctx.showSuperNext ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
        _ctx.icons && _ctx.icons.nextDouble ? (openBlock(), createBlock(_component_RenderFunction, {
          key: 0,
          "render-func": _ctx.icons && _ctx.icons.nextDouble
        }, null, 8, ["render-func"])) : (openBlock(), createBlock(_component_IconDoubleRight, { key: 1 }))
      ], 64)) : createCommentVNode("v-if", true)
    ], 2)
  ], 2);
}
var PanelHeader = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { PanelHeader as default };
