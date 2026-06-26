import { defineComponent, getCurrentInstance, inject, computed, ref, reactive, onBeforeUnmount, resolveComponent, openBlock, createElementBlock, normalizeClass, createCommentVNode, renderSlot, createBlock, Fragment, createTextVNode, toDisplayString, createElementVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconCheck from "../icon/icon-check/index.js";
import IconClose from "../icon/icon-close/index.js";
import { stepsInjectionKey } from "./context.js";
import { useIndex } from "../_hooks/use-index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Step",
  components: {
    IconCheck,
    IconClose
  },
  props: {
    title: String,
    description: String,
    status: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const prefixCls = getPrefixCls("steps-item");
    const instance = getCurrentInstance();
    const iconCls = getPrefixCls("steps-icon");
    const stepsCtx = inject(stepsInjectionKey, void 0);
    const type = computed(() => {
      var _a;
      return (_a = stepsCtx == null ? void 0 : stepsCtx.type) != null ? _a : "default";
    });
    const itemRef = ref();
    const { computedIndex } = useIndex({
      itemRef,
      selector: `.${prefixCls}`,
      parentClassName: stepsCtx == null ? void 0 : stepsCtx.parentCls
    });
    const stepNumber = computed(() => computedIndex.value + 1);
    const computedStatus = computed(
      () => {
        var _a, _b;
        return (_b = (_a = props.status) != null ? _a : stepsCtx == null ? void 0 : stepsCtx.getStatus(stepNumber.value)) != null ? _b : "process";
      }
    );
    const nextStepError = computed(
      () => {
        var _a;
        return (_a = stepsCtx == null ? void 0 : stepsCtx.errorSteps.includes(stepNumber.value + 1)) != null ? _a : false;
      }
    );
    if (instance) {
      stepsCtx == null ? void 0 : stepsCtx.addItem(
        instance.uid,
        reactive({
          step: stepNumber,
          status: computedStatus
        })
      );
    }
    onBeforeUnmount(() => {
      if (instance) {
        stepsCtx == null ? void 0 : stepsCtx.removeItem(instance.uid);
      }
    });
    const showTail = computed(
      () => !(stepsCtx == null ? void 0 : stepsCtx.lineLess) && ((stepsCtx == null ? void 0 : stepsCtx.labelPlacement) === "vertical" || (stepsCtx == null ? void 0 : stepsCtx.direction) === "vertical")
    );
    const handleClick = (ev) => {
      if (!props.disabled) {
        stepsCtx == null ? void 0 : stepsCtx.onClick(stepNumber.value, ev);
      }
    };
    const cls = computed(() => [
      prefixCls,
      `${prefixCls}-${computedStatus.value}`,
      {
        [`${prefixCls}-active`]: stepNumber.value === (stepsCtx == null ? void 0 : stepsCtx.current),
        [`${prefixCls}-next-error`]: nextStepError.value,
        [`${prefixCls}-disabled`]: props.disabled
      }
    ]);
    return {
      prefixCls,
      iconCls,
      cls,
      itemRef,
      showTail,
      stepNumber,
      computedStatus,
      type,
      handleClick
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_check = resolveComponent("icon-check");
  const _component_icon_close = resolveComponent("icon-close");
  return openBlock(), createElementBlock("div", {
    ref: "itemRef",
    class: normalizeClass(_ctx.cls),
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
  }, [
    _ctx.showTail ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-tail`)
    }, null, 2)) : createCommentVNode("v-if", true),
    _ctx.type !== "arrow" ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass(`${_ctx.prefixCls}-node`)
    }, [
      renderSlot(_ctx.$slots, "node", {
        step: _ctx.stepNumber,
        status: _ctx.computedStatus
      }, () => [
        _ctx.type !== "dot" ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(_ctx.iconCls)
        }, [
          renderSlot(_ctx.$slots, "icon", {
            step: _ctx.stepNumber,
            status: _ctx.computedStatus
          }, () => [
            _ctx.computedStatus === "finish" ? (openBlock(), createBlock(_component_icon_check, { key: 0 })) : _ctx.computedStatus === "error" ? (openBlock(), createBlock(_component_icon_close, { key: 1 })) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
              createTextVNode(toDisplayString(_ctx.stepNumber), 1)
            ], 64))
          ])
        ], 2)) : createCommentVNode("v-if", true)
      ])
    ], 2)) : createCommentVNode("v-if", true),
    createElementVNode("div", {
      class: normalizeClass(`${_ctx.prefixCls}-content`)
    }, [
      createElementVNode("div", {
        class: normalizeClass(`${_ctx.prefixCls}-title`)
      }, [
        renderSlot(_ctx.$slots, "default", {}, () => [
          createTextVNode(toDisplayString(_ctx.title), 1)
        ])
      ], 2),
      _ctx.description || _ctx.$slots.description ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(`${_ctx.prefixCls}-description`)
      }, [
        renderSlot(_ctx.$slots, "description", {}, () => [
          createTextVNode(toDisplayString(_ctx.description), 1)
        ])
      ], 2)) : createCommentVNode("v-if", true)
    ], 2)
  ], 2);
}
var Step = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Step as default };
