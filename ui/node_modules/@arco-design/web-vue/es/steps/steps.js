import { defineComponent, toRefs, ref, computed, reactive, provide, openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { stepsInjectionKey } from "./context.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
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
    const { type, lineLess } = toRefs(props);
    const prefixCls = getPrefixCls("steps");
    const _current = ref(props.defaultCurrent);
    const computedCurrent = computed(() => {
      var _a;
      return (_a = props.current) != null ? _a : _current.value;
    });
    const direction = computed(
      () => ["navigation", "arrow"].includes(props.type) ? "horizontal" : props.direction
    );
    const labelPlacement = computed(() => {
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
    const stepMap = reactive(/* @__PURE__ */ new Map());
    const errorSteps = computed(
      () => Array.from(stepMap.values()).filter((item) => item.status === "error").map((item) => item.step)
    );
    const addItem = (step, data) => {
      stepMap.set(step, data);
    };
    const removeItem = (step) => {
      stepMap.delete(step);
    };
    const cls = computed(() => [
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
    provide(
      stepsInjectionKey,
      reactive({
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
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.cls)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var _Steps = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Steps as default };
