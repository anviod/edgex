import { defineComponent, getCurrentInstance, inject, computed, openBlock, createElementBlock, normalizeClass, createElementVNode, normalizeStyle, renderSlot, createCommentVNode, Fragment, createTextVNode, toDisplayString } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { timelineInjectionKey } from "./context.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const getDefaultPosition = (index, mode, direction, position) => {
  let map = ["left", "right"];
  if (direction === "horizontal") {
    map = ["top", "bottom"];
  }
  const res = mode === "alternate" ? position || map[index % 2] : mode;
  return map.indexOf(res) > -1 ? res : map[0];
};
const _sfc_main = defineComponent({
  name: "TimelineItem",
  props: {
    dotColor: {
      type: String
    },
    dotType: {
      type: String,
      default: "solid"
    },
    lineType: {
      type: String,
      default: "solid"
    },
    lineColor: {
      type: String
    },
    label: {
      type: String
    },
    position: {
      type: String
    }
  },
  setup(props) {
    const prefixCls = getPrefixCls("timeline-item");
    const instance = getCurrentInstance();
    const context = inject(timelineInjectionKey, {});
    const index = computed(
      () => {
        var _a, _b, _c;
        return (_c = (_b = context.items) == null ? void 0 : _b.indexOf((_a = instance == null ? void 0 : instance.uid) != null ? _a : -1)) != null ? _c : -1;
      }
    );
    const contextDirection = computed(() => {
      var _a;
      return (_a = context == null ? void 0 : context.direction) != null ? _a : "vertical";
    });
    const contextLabelPosition = computed(() => {
      var _a;
      return (_a = context == null ? void 0 : context.labelPosition) != null ? _a : "same";
    });
    const cls = computed(() => {
      const { items = [], reverse, labelPosition, mode = "left" } = context;
      const direction = contextDirection.value;
      const computedPosition = getDefaultPosition(
        index.value,
        mode,
        direction,
        props.position
      );
      return [
        prefixCls,
        {
          [`${prefixCls}-${direction}-${computedPosition}`]: direction,
          [`${prefixCls}-label-${labelPosition}`]: labelPosition,
          [`${prefixCls}-last`]: index.value === (reverse === true ? 0 : items.length - 1)
        }
      ];
    });
    const dotLineCls = computed(() => {
      return [
        `${prefixCls}-dot-line`,
        `${prefixCls}-dot-line-is-${contextDirection.value}`
      ];
    });
    const computedDotLineStyle = computed(() => {
      const { direction } = context || {};
      return {
        [direction === "horizontal" ? "borderTopStyle" : "borderLeftStyle"]: props.lineType,
        ...props.lineColor ? { borderColor: props.lineColor } : {}
      };
    });
    const dotTypeCls = computed(() => {
      return [`${prefixCls}-dot`, `${prefixCls}-dot-${props.dotType}`];
    });
    const computedDotStyle = computed(() => {
      return {
        [props.dotType === "solid" ? "backgroundColor" : "borderColor"]: props.dotColor
      };
    });
    return {
      cls,
      dotLineCls,
      dotTypeCls,
      prefixCls,
      computedDotLineStyle,
      computedDotStyle,
      labelPosition: contextLabelPosition
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    role: "listitem",
    class: normalizeClass(_ctx.cls)
  }, [
    createElementVNode("div", {
      class: normalizeClass(`${_ctx.prefixCls}-dot-wrapper`)
    }, [
      createElementVNode("div", {
        class: normalizeClass(_ctx.dotLineCls),
        style: normalizeStyle(_ctx.computedDotLineStyle)
      }, null, 6),
      createElementVNode("div", {
        class: normalizeClass(`${_ctx.prefixCls}-dot-content`)
      }, [
        _ctx.$slots.dot ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(`${_ctx.prefixCls}-dot-custom`)
        }, [
          renderSlot(_ctx.$slots, "dot")
        ], 2)) : (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass(_ctx.dotTypeCls),
          style: normalizeStyle(_ctx.computedDotStyle)
        }, null, 6))
      ], 2)
    ], 2),
    createElementVNode("div", {
      class: normalizeClass(`${_ctx.prefixCls}-content-wrapper`)
    }, [
      _ctx.$slots.default ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(`${_ctx.prefixCls}-content`)
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2)) : createCommentVNode("v-if", true),
      _ctx.labelPosition !== "relative" ? (openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass(`${_ctx.prefixCls}-label`)
      }, [
        _ctx.$slots.label ? renderSlot(_ctx.$slots, "label", { key: 0 }) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createTextVNode(toDisplayString(_ctx.label), 1)
        ], 64))
      ], 2)) : createCommentVNode("v-if", true)
    ], 2),
    _ctx.labelPosition === "relative" ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-label`)
    }, [
      _ctx.$slots.label ? renderSlot(_ctx.$slots, "label", { key: 0 }) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
        createTextVNode(toDisplayString(_ctx.label), 1)
      ], 64))
    ], 2)) : createCommentVNode("v-if", true)
  ], 2);
}
var TimelineItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { TimelineItem as default };
