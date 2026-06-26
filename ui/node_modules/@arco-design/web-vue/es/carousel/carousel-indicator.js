import { defineComponent, computed, openBlock, createElementBlock, mergeProps, normalizeStyle, normalizeClass, Fragment, renderList } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Indicator",
  props: {
    count: {
      type: Number,
      default: 2
    },
    activeIndex: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: "line"
    },
    position: {
      type: String,
      default: "bottom"
    },
    trigger: {
      type: String,
      default: "click"
    }
  },
  emits: ["select"],
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("carousel-indicator");
    const onClick = (event) => {
      var _a;
      event.preventDefault();
      if (props.type === "slider") {
        const x = event.offsetX;
        const width = event.currentTarget.clientWidth;
        if (event.target === event.currentTarget) {
          const index = Math.floor(x / width * props.count);
          index !== props.activeIndex && emit("select", index);
        }
      } else {
        const index = Number.parseInt(
          (_a = event.target.getAttribute("data-index")) != null ? _a : "",
          10
        );
        if (!Number.isNaN(index) && index !== props.activeIndex) {
          emit("select", index);
        }
      }
    };
    const eventHandlers = computed(() => {
      return props.trigger === "click" ? { onClick } : { onMouseover: onClick };
    });
    const cls = computed(() => [
      `${prefixCls}`,
      `${prefixCls}-${props.type}`,
      `${prefixCls}-${props.position}`
    ]);
    const sliderStyle = computed(() => {
      const step = 100 / props.count;
      return { width: `${step}%`, left: `${props.activeIndex * step}%` };
    });
    return {
      prefixCls,
      eventHandlers,
      cls,
      sliderStyle
    };
  }
});
const _hoisted_1 = ["data-index"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({ class: _ctx.cls }, _ctx.eventHandlers), [
    _ctx.type === "slider" ? (openBlock(), createElementBlock("span", {
      key: 0,
      style: normalizeStyle(_ctx.sliderStyle),
      class: normalizeClass([`${_ctx.prefixCls}-item`, `${_ctx.prefixCls}-item-active`])
    }, null, 6)) : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(Array(_ctx.count), (_, index) => {
      return openBlock(), createElementBlock("span", {
        key: index,
        "data-index": index,
        class: normalizeClass([
          `${_ctx.prefixCls}-item`,
          { [`${_ctx.prefixCls}-item-active`]: index === _ctx.activeIndex }
        ])
      }, null, 10, _hoisted_1);
    }), 128))
  ], 16);
}
var CarouselIndicator = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { CarouselIndicator as default };
