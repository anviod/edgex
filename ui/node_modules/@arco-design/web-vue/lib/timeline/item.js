"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var context = require("./context.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const getDefaultPosition = (index, mode, direction, position) => {
  let map = ["left", "right"];
  if (direction === "horizontal") {
    map = ["top", "bottom"];
  }
  const res = mode === "alternate" ? position || map[index % 2] : mode;
  return map.indexOf(res) > -1 ? res : map[0];
};
const _sfc_main = vue.defineComponent({
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
    const prefixCls = globalConfig.getPrefixCls("timeline-item");
    const instance = vue.getCurrentInstance();
    const context$1 = vue.inject(context.timelineInjectionKey, {});
    const index = vue.computed(
      () => {
        var _a, _b, _c;
        return (_c = (_b = context$1.items) == null ? void 0 : _b.indexOf((_a = instance == null ? void 0 : instance.uid) != null ? _a : -1)) != null ? _c : -1;
      }
    );
    const contextDirection = vue.computed(() => {
      var _a;
      return (_a = context$1 == null ? void 0 : context$1.direction) != null ? _a : "vertical";
    });
    const contextLabelPosition = vue.computed(() => {
      var _a;
      return (_a = context$1 == null ? void 0 : context$1.labelPosition) != null ? _a : "same";
    });
    const cls = vue.computed(() => {
      const { items = [], reverse, labelPosition, mode = "left" } = context$1;
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
    const dotLineCls = vue.computed(() => {
      return [
        `${prefixCls}-dot-line`,
        `${prefixCls}-dot-line-is-${contextDirection.value}`
      ];
    });
    const computedDotLineStyle = vue.computed(() => {
      const { direction } = context$1 || {};
      return {
        [direction === "horizontal" ? "borderTopStyle" : "borderLeftStyle"]: props.lineType,
        ...props.lineColor ? { borderColor: props.lineColor } : {}
      };
    });
    const dotTypeCls = vue.computed(() => {
      return [`${prefixCls}-dot`, `${prefixCls}-dot-${props.dotType}`];
    });
    const computedDotStyle = vue.computed(() => {
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
  return vue.openBlock(), vue.createElementBlock("div", {
    role: "listitem",
    class: vue.normalizeClass(_ctx.cls)
  }, [
    vue.createElementVNode("div", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-dot-wrapper`)
    }, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(_ctx.dotLineCls),
        style: vue.normalizeStyle(_ctx.computedDotLineStyle)
      }, null, 6),
      vue.createElementVNode("div", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-dot-content`)
      }, [
        _ctx.$slots.dot ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(`${_ctx.prefixCls}-dot-custom`)
        }, [
          vue.renderSlot(_ctx.$slots, "dot")
        ], 2)) : (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          class: vue.normalizeClass(_ctx.dotTypeCls),
          style: vue.normalizeStyle(_ctx.computedDotStyle)
        }, null, 6))
      ], 2)
    ], 2),
    vue.createElementVNode("div", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-content-wrapper`)
    }, [
      _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass(`${_ctx.prefixCls}-content`)
      }, [
        vue.renderSlot(_ctx.$slots, "default")
      ], 2)) : vue.createCommentVNode("v-if", true),
      _ctx.labelPosition !== "relative" ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 1,
        class: vue.normalizeClass(`${_ctx.prefixCls}-label`)
      }, [
        _ctx.$slots.label ? vue.renderSlot(_ctx.$slots, "label", { key: 0 }) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
          vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
        ], 64))
      ], 2)) : vue.createCommentVNode("v-if", true)
    ], 2),
    _ctx.labelPosition === "relative" ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-label`)
    }, [
      _ctx.$slots.label ? vue.renderSlot(_ctx.$slots, "label", { key: 0 }) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
        vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
      ], 64))
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 2);
}
var TimelineItem = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = TimelineItem;
