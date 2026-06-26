import { defineComponent, computed, resolveComponent, openBlock, createBlock, resolveDynamicComponent, normalizeClass, withCtx, renderSlot } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconLeft from "../icon/icon-left/index.js";
import IconRight from "../icon/icon-right/index.js";
import { getLegalPage } from "./utils.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "StepPager",
  components: {
    IconLeft,
    IconRight
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
    const prefixCls = getPrefixCls("pagination-item");
    const isNext = props.type === "next";
    const mergedDisabled = computed(() => {
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
    const nextPage = computed(
      () => getLegalPage(props.current + (isNext ? 1 : -1), {
        min: 1,
        max: props.pages
      })
    );
    const handleClick = (e) => {
      if (!mergedDisabled.value) {
        emit("click", nextPage.value);
      }
    };
    const cls = computed(() => [
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
  const _component_icon_right = resolveComponent("icon-right");
  const _component_icon_left = resolveComponent("icon-left");
  return openBlock(), createBlock(resolveDynamicComponent(_ctx.simple ? "span" : "li"), {
    class: normalizeClass(_ctx.cls),
    onClick: _ctx.handleClick
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default", {
        type: _ctx.isNext ? "next" : "previous"
      }, () => [
        _ctx.isNext ? (openBlock(), createBlock(_component_icon_right, { key: 0 })) : (openBlock(), createBlock(_component_icon_left, { key: 1 }))
      ])
    ]),
    _: 3
  }, 8, ["class", "onClick"]);
}
var StepPager = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { StepPager as default };
