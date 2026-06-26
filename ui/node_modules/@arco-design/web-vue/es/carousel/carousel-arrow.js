import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, createBlock } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconUp from "../icon/icon-up/index.js";
import IconDown from "../icon/icon-down/index.js";
import IconLeft from "../icon/icon-left/index.js";
import IconRight from "../icon/icon-right/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Arrow",
  components: {
    IconUp,
    IconDown,
    IconLeft,
    IconRight
  },
  props: {
    direction: {
      type: String,
      default: "horizontal"
    },
    showArrow: {
      type: String,
      default: "always"
    }
  },
  emits: ["previousClick", "nextClick"],
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("carousel");
    const onPreviousClick = (ev) => {
      emit("previousClick", ev);
    };
    const onNextClick = (ev) => {
      emit("nextClick", ev);
    };
    const cls = computed(() => [
      `${prefixCls}-arrow`,
      {
        [`${prefixCls}-arrow-hover`]: props.showArrow === "hover"
      }
    ]);
    return {
      prefixCls,
      cls,
      onPreviousClick,
      onNextClick
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconLeft = resolveComponent("IconLeft");
  const _component_IconUp = resolveComponent("IconUp");
  const _component_IconRight = resolveComponent("IconRight");
  const _component_IconDown = resolveComponent("IconDown");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.cls)
  }, [
    createElementVNode("div", {
      class: normalizeClass(`${_ctx.prefixCls}-arrow-${_ctx.direction === "vertical" ? "top" : "left"}`),
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onPreviousClick && _ctx.onPreviousClick(...args))
    }, [
      _ctx.direction === "horizontal" ? (openBlock(), createBlock(_component_IconLeft, { key: 0 })) : (openBlock(), createBlock(_component_IconUp, { key: 1 }))
    ], 2),
    createElementVNode("div", {
      class: normalizeClass(`${_ctx.prefixCls}-arrow-${_ctx.direction === "vertical" ? "bottom" : "right"}`),
      onClick: _cache[1] || (_cache[1] = (...args) => _ctx.onNextClick && _ctx.onNextClick(...args))
    }, [
      _ctx.direction === "horizontal" ? (openBlock(), createBlock(_component_IconRight, { key: 0 })) : (openBlock(), createBlock(_component_IconDown, { key: 1 }))
    ], 2)
  ], 2);
}
var CarouselArrow = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { CarouselArrow as default };
