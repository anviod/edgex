import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, normalizeStyle, Fragment, renderList, renderSlot, createTextVNode, toDisplayString, createBlock, createCommentVNode } from "vue";
import NP from "number-precision";
import { getPrefixCls } from "../_utils/global-config.js";
import IconExclamationCircleFill from "../icon/icon-exclamation-circle-fill/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "ProgressSteps",
  components: {
    IconExclamationCircleFill
  },
  props: {
    steps: {
      type: Number,
      default: 0
    },
    percent: {
      type: Number,
      default: 0
    },
    size: {
      type: String
    },
    color: {
      type: [String, Object],
      default: void 0
    },
    trackColor: String,
    strokeWidth: {
      type: Number
    },
    status: {
      type: String,
      default: void 0
    },
    showText: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const prefixCls = getPrefixCls("progress-steps");
    const mergedStrokeWidth = computed(
      () => {
        var _a;
        return ((_a = props.strokeWidth) != null ? _a : props.size === "small") ? 8 : 4;
      }
    );
    const stepList = computed(
      () => [...Array(props.steps)].map((_, index) => {
        return props.percent > 0 && props.percent > 1 / props.steps * index;
      })
    );
    const text = computed(() => `${NP.times(props.percent, 100)}%`);
    return {
      prefixCls,
      stepList,
      mergedStrokeWidth,
      text
    };
  }
});
const _hoisted_1 = ["aria-valuenow"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_exclamation_circle_fill = resolveComponent("icon-exclamation-circle-fill");
  return openBlock(), createElementBlock("div", {
    role: "progressbar",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuenow": _ctx.percent,
    class: normalizeClass(`${_ctx.prefixCls}-wrapper`)
  }, [
    createElementVNode("div", {
      class: normalizeClass(_ctx.prefixCls),
      style: normalizeStyle({ height: `${_ctx.mergedStrokeWidth}px` })
    }, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.stepList, (active, index) => {
        return openBlock(), createElementBlock("div", {
          key: index,
          class: normalizeClass([
            `${_ctx.prefixCls}-item`,
            {
              [`${_ctx.prefixCls}-item-active`]: active
            }
          ]),
          style: normalizeStyle({
            backgroundColor: active ? _ctx.color : _ctx.trackColor
          })
        }, null, 6);
      }), 128))
    ], 6),
    _ctx.showText ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-text`)
    }, [
      renderSlot(_ctx.$slots, "text", { percent: _ctx.percent }, () => [
        createTextVNode(toDisplayString(_ctx.text) + " ", 1),
        _ctx.status === "danger" ? (openBlock(), createBlock(_component_icon_exclamation_circle_fill, { key: 0 })) : createCommentVNode("v-if", true)
      ])
    ], 2)) : createCommentVNode("v-if", true)
  ], 10, _hoisted_1);
}
var ProgressSteps = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { ProgressSteps as default };
