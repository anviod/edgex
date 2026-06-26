import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, normalizeStyle, renderSlot, createTextVNode, toDisplayString, createBlock, createCommentVNode } from "vue";
import NP from "number-precision";
import { getPrefixCls } from "../_utils/global-config.js";
import { isObject } from "../_utils/is.js";
import IconExclamationCircleFill from "../icon/icon-exclamation-circle-fill/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const DEFAULT_STROKE_WIDTH = {
  small: 3,
  medium: 4,
  large: 8
};
const getBackground = (color) => {
  if (!color) {
    return void 0;
  }
  if (isObject(color)) {
    const val = Object.keys(color).map((key) => `${color[key]} ${key}`).join(",");
    return {
      backgroundImage: `linear-gradient(to right, ${val})`
    };
  }
  return {
    backgroundColor: color
  };
};
const _sfc_main = defineComponent({
  name: "ProgressLine",
  components: {
    IconExclamationCircleFill
  },
  props: {
    percent: {
      type: Number,
      default: 0
    },
    animation: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "medium"
    },
    strokeWidth: {
      type: Number,
      default: 4
    },
    width: {
      type: [Number, String],
      default: "100%"
    },
    color: {
      type: [String, Object],
      default: void 0
    },
    trackColor: String,
    formatText: {
      type: Function,
      default: void 0
    },
    status: {
      type: String
    },
    showText: Boolean
  },
  setup(props) {
    const prefixCls = getPrefixCls("progress-line");
    const strokeWidth = computed(() => {
      if (props.strokeWidth !== 4) {
        return props.strokeWidth;
      }
      return DEFAULT_STROKE_WIDTH[props.size];
    });
    const text = computed(() => `${NP.times(props.percent, 100)}%`);
    const style = computed(() => ({
      width: props.width,
      height: `${strokeWidth.value}px`,
      backgroundColor: props.trackColor
    }));
    const barStyle = computed(() => ({
      width: `${props.percent * 100}%`,
      ...getBackground(props.color)
    }));
    return {
      prefixCls,
      style,
      barStyle,
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
      style: normalizeStyle(_ctx.style)
    }, [
      createElementVNode("div", {
        class: normalizeClass(`${_ctx.prefixCls}-bar-buffer`)
      }, null, 2),
      createElementVNode("div", {
        class: normalizeClass([`${_ctx.prefixCls}-bar`]),
        style: normalizeStyle(_ctx.barStyle)
      }, null, 6)
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
var ProgressLine = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { ProgressLine as default };
