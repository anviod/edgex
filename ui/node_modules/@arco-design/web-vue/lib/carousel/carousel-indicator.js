"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
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
    const prefixCls = globalConfig.getPrefixCls("carousel-indicator");
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
    const eventHandlers = vue.computed(() => {
      return props.trigger === "click" ? { onClick } : { onMouseover: onClick };
    });
    const cls = vue.computed(() => [
      `${prefixCls}`,
      `${prefixCls}-${props.type}`,
      `${prefixCls}-${props.position}`
    ]);
    const sliderStyle = vue.computed(() => {
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
  return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({ class: _ctx.cls }, _ctx.eventHandlers), [
    _ctx.type === "slider" ? (vue.openBlock(), vue.createElementBlock("span", {
      key: 0,
      style: vue.normalizeStyle(_ctx.sliderStyle),
      class: vue.normalizeClass([`${_ctx.prefixCls}-item`, `${_ctx.prefixCls}-item-active`])
    }, null, 6)) : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(Array(_ctx.count), (_, index) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        key: index,
        "data-index": index,
        class: vue.normalizeClass([
          `${_ctx.prefixCls}-item`,
          { [`${_ctx.prefixCls}-item-active`]: index === _ctx.activeIndex }
        ])
      }, null, 10, _hoisted_1);
    }), 128))
  ], 16);
}
var CarouselIndicator = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = CarouselIndicator;
