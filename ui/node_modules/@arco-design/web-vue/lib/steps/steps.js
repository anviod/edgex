"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var context = require("./context.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Steps",
  props: {
    type: {
      type: String,
      default: "default"
    },
    direction: {
      type: String,
      default: "horizontal"
    },
    labelPlacement: {
      type: String,
      default: "horizontal"
    },
    current: {
      type: Number,
      default: void 0
    },
    defaultCurrent: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      default: "process"
    },
    lineLess: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    changeable: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    "update:current": (step) => true,
    "change": (step, ev) => true
  },
  setup(props, { emit, slots }) {
    const { type, lineLess } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("steps");
    const _current = vue.ref(props.defaultCurrent);
    const computedCurrent = vue.computed(() => {
      var _a;
      return (_a = props.current) != null ? _a : _current.value;
    });
    const direction = vue.computed(
      () => ["navigation", "arrow"].includes(props.type) ? "horizontal" : props.direction
    );
    const labelPlacement = vue.computed(() => {
      if (props.type === "dot") {
        return direction.value === "vertical" ? "horizontal" : "vertical";
      }
      if (props.type === "navigation") {
        return "horizontal";
      }
      return props.labelPlacement;
    });
    const getStatus = (step) => {
      if (step < computedCurrent.value) {
        return "finish";
      }
      if (step > computedCurrent.value) {
        return "wait";
      }
      return props.status;
    };
    const handleClick = (step, e) => {
      if (props.changeable) {
        _current.value = step;
        emit("update:current", step);
        emit("change", step, e);
      }
    };
    const stepMap = vue.reactive(/* @__PURE__ */ new Map());
    const errorSteps = vue.computed(
      () => Array.from(stepMap.values()).filter((item) => item.status === "error").map((item) => item.step)
    );
    const addItem = (step, data) => {
      stepMap.set(step, data);
    };
    const removeItem = (step) => {
      stepMap.delete(step);
    };
    const cls = vue.computed(() => [
      prefixCls,
      `${prefixCls}-${direction.value}`,
      `${prefixCls}-label-${labelPlacement.value}`,
      `${prefixCls}-mode-${type.value}`,
      {
        [`${prefixCls}-changeable`]: props.changeable,
        [`${prefixCls}-size-small`]: props.small && props.type !== "dot",
        [`${prefixCls}-line-less`]: lineLess.value
      }
    ]);
    vue.provide(
      context.stepsInjectionKey,
      vue.reactive({
        type,
        direction,
        labelPlacement,
        lineLess,
        current: computedCurrent,
        errorSteps,
        getStatus,
        addItem,
        removeItem,
        onClick: handleClick,
        parentCls: prefixCls
      })
    );
    return {
      cls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.cls)
  }, [
    vue.renderSlot(_ctx.$slots, "default")
  ], 2);
}
var _Steps = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Steps;
