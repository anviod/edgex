"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var context = require("./context.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "CarouselItem",
  setup() {
    const prefixCls = globalConfig.getPrefixCls("carousel-item");
    const instance = vue.getCurrentInstance();
    const context$1 = vue.inject(context.carouselInjectionKey, {});
    const index = vue.computed(
      () => {
        var _a, _b, _c;
        return (_c = (_b = context$1.items) == null ? void 0 : _b.indexOf((_a = instance == null ? void 0 : instance.uid) != null ? _a : -1)) != null ? _c : -1;
      }
    );
    const isCurrent = vue.computed(
      () => {
        var _a;
        return ((_a = context$1.mergedIndexes) == null ? void 0 : _a.mergedIndex) === index.value;
      }
    );
    const cls = vue.computed(() => {
      const { previousIndex, animationName, slideDirection, mergedIndexes } = context$1;
      return {
        [`${prefixCls}-prev`]: index.value === (mergedIndexes == null ? void 0 : mergedIndexes.mergedPrevIndex),
        [`${prefixCls}-next`]: index.value === (mergedIndexes == null ? void 0 : mergedIndexes.mergedNextIndex),
        [`${prefixCls}-current`]: isCurrent.value,
        [`${prefixCls}-slide-in`]: animationName === "slide" && slideDirection && isCurrent.value,
        [`${prefixCls}-slide-out`]: animationName === "slide" && slideDirection && index.value === previousIndex
      };
    });
    const animationStyle = vue.computed(() => {
      const { transitionTimingFunction, moveSpeed } = context$1;
      return {
        transitionTimingFunction,
        transitionDuration: `${moveSpeed}ms`,
        animationTimingFunction: transitionTimingFunction,
        animationDuration: `${moveSpeed}ms`
      };
    });
    return {
      cls,
      animationStyle,
      isCurrent
    };
  }
});
const _hoisted_1 = ["aria-hidden"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", {
    "aria-hidden": !_ctx.isCurrent,
    class: vue.normalizeClass(_ctx.cls),
    style: vue.normalizeStyle(_ctx.animationStyle)
  }, [
    vue.renderSlot(_ctx.$slots, "default")
  ], 14, _hoisted_1);
}
var CarouselItem = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = CarouselItem;
