import { defineComponent, getCurrentInstance, inject, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { carouselInjectionKey } from "./context.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "CarouselItem",
  setup() {
    const prefixCls = getPrefixCls("carousel-item");
    const instance = getCurrentInstance();
    const context = inject(carouselInjectionKey, {});
    const index = computed(
      () => {
        var _a, _b, _c;
        return (_c = (_b = context.items) == null ? void 0 : _b.indexOf((_a = instance == null ? void 0 : instance.uid) != null ? _a : -1)) != null ? _c : -1;
      }
    );
    const isCurrent = computed(
      () => {
        var _a;
        return ((_a = context.mergedIndexes) == null ? void 0 : _a.mergedIndex) === index.value;
      }
    );
    const cls = computed(() => {
      const { previousIndex, animationName, slideDirection, mergedIndexes } = context;
      return {
        [`${prefixCls}-prev`]: index.value === (mergedIndexes == null ? void 0 : mergedIndexes.mergedPrevIndex),
        [`${prefixCls}-next`]: index.value === (mergedIndexes == null ? void 0 : mergedIndexes.mergedNextIndex),
        [`${prefixCls}-current`]: isCurrent.value,
        [`${prefixCls}-slide-in`]: animationName === "slide" && slideDirection && isCurrent.value,
        [`${prefixCls}-slide-out`]: animationName === "slide" && slideDirection && index.value === previousIndex
      };
    });
    const animationStyle = computed(() => {
      const { transitionTimingFunction, moveSpeed } = context;
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
  return openBlock(), createElementBlock("div", {
    "aria-hidden": !_ctx.isCurrent,
    class: normalizeClass(_ctx.cls),
    style: normalizeStyle(_ctx.animationStyle)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 14, _hoisted_1);
}
var CarouselItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { CarouselItem as default };
