"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../icon/icon-left/index.js");
var index$1 = require("../icon/icon-right/index.js");
var utils = require("./utils.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "StepPager",
  components: {
    IconLeft: index,
    IconRight: index$1
  },
  props: {
    pages: {
      type: Number,
      required: true
    },
    current: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    simple: {
      type: Boolean,
      default: false
    }
  },
  emits: ["click"],
  setup(props, { emit }) {
    const prefixCls = globalConfig.getPrefixCls("pagination-item");
    const isNext = props.type === "next";
    const mergedDisabled = vue.computed(() => {
      if (props.disabled) {
        return props.disabled;
      }
      if (!props.pages) {
        return true;
      }
      if (isNext && props.current === props.pages) {
        return true;
      }
      return !isNext && props.current <= 1;
    });
    const nextPage = vue.computed(
      () => utils.getLegalPage(props.current + (isNext ? 1 : -1), {
        min: 1,
        max: props.pages
      })
    );
    const handleClick = (e) => {
      if (!mergedDisabled.value) {
        emit("click", nextPage.value);
      }
    };
    const cls = vue.computed(() => [
      prefixCls,
      `${prefixCls}-${props.type}`,
      {
        [`${prefixCls}-disabled`]: mergedDisabled.value
      }
    ]);
    return {
      prefixCls,
      cls,
      isNext,
      handleClick
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_right = vue.resolveComponent("icon-right");
  const _component_icon_left = vue.resolveComponent("icon-left");
  return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.simple ? "span" : "li"), {
    class: vue.normalizeClass(_ctx.cls),
    onClick: _ctx.handleClick
  }, {
    default: vue.withCtx(() => [
      vue.renderSlot(_ctx.$slots, "default", {
        type: _ctx.isNext ? "next" : "previous"
      }, () => [
        _ctx.isNext ? (vue.openBlock(), vue.createBlock(_component_icon_right, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_icon_left, { key: 1 }))
      ])
    ]),
    _: 3
  }, 8, ["class", "onClick"]);
}
var StepPager = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = StepPager;
