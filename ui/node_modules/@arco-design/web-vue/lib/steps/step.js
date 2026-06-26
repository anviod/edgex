"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../icon/icon-check/index.js");
var index$1 = require("../icon/icon-close/index.js");
var context = require("./context.js");
var useIndex = require("../_hooks/use-index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Step",
  components: {
    IconCheck: index,
    IconClose: index$1
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
    const prefixCls = globalConfig.getPrefixCls("steps-item");
    const instance = vue.getCurrentInstance();
    const iconCls = globalConfig.getPrefixCls("steps-icon");
    const stepsCtx = vue.inject(context.stepsInjectionKey, void 0);
    const type = vue.computed(() => {
      var _a;
      return (_a = stepsCtx == null ? void 0 : stepsCtx.type) != null ? _a : "default";
    });
    const itemRef = vue.ref();
    const { computedIndex } = useIndex.useIndex({
      itemRef,
      selector: `.${prefixCls}`,
      parentClassName: stepsCtx == null ? void 0 : stepsCtx.parentCls
    });
    const stepNumber = vue.computed(() => computedIndex.value + 1);
    const computedStatus = vue.computed(
      () => {
        var _a, _b;
        return (_b = (_a = props.status) != null ? _a : stepsCtx == null ? void 0 : stepsCtx.getStatus(stepNumber.value)) != null ? _b : "process";
      }
    );
    const nextStepError = vue.computed(
      () => {
        var _a;
        return (_a = stepsCtx == null ? void 0 : stepsCtx.errorSteps.includes(stepNumber.value + 1)) != null ? _a : false;
      }
    );
    if (instance) {
      stepsCtx == null ? void 0 : stepsCtx.addItem(
        instance.uid,
        vue.reactive({
          step: stepNumber,
          status: computedStatus
        })
      );
    }
    vue.onBeforeUnmount(() => {
      if (instance) {
        stepsCtx == null ? void 0 : stepsCtx.removeItem(instance.uid);
      }
    });
    const showTail = vue.computed(
      () => !(stepsCtx == null ? void 0 : stepsCtx.lineLess) && ((stepsCtx == null ? void 0 : stepsCtx.labelPlacement) === "vertical" || (stepsCtx == null ? void 0 : stepsCtx.direction) === "vertical")
    );
    const handleClick = (ev) => {
      if (!props.disabled) {
        stepsCtx == null ? void 0 : stepsCtx.onClick(stepNumber.value, ev);
      }
    };
    const cls = vue.computed(() => [
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
  const _component_icon_check = vue.resolveComponent("icon-check");
  const _component_icon_close = vue.resolveComponent("icon-close");
  return vue.openBlock(), vue.createElementBlock("div", {
    ref: "itemRef",
    class: vue.normalizeClass(_ctx.cls),
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
  }, [
    _ctx.showTail ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-tail`)
    }, null, 2)) : vue.createCommentVNode("v-if", true),
    _ctx.type !== "arrow" ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 1,
      class: vue.normalizeClass(`${_ctx.prefixCls}-node`)
    }, [
      vue.renderSlot(_ctx.$slots, "node", {
        step: _ctx.stepNumber,
        status: _ctx.computedStatus
      }, () => [
        _ctx.type !== "dot" ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(_ctx.iconCls)
        }, [
          vue.renderSlot(_ctx.$slots, "icon", {
            step: _ctx.stepNumber,
            status: _ctx.computedStatus
          }, () => [
            _ctx.computedStatus === "finish" ? (vue.openBlock(), vue.createBlock(_component_icon_check, { key: 0 })) : _ctx.computedStatus === "error" ? (vue.openBlock(), vue.createBlock(_component_icon_close, { key: 1 })) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 2 }, [
              vue.createTextVNode(vue.toDisplayString(_ctx.stepNumber), 1)
            ], 64))
          ])
        ], 2)) : vue.createCommentVNode("v-if", true)
      ])
    ], 2)) : vue.createCommentVNode("v-if", true),
    vue.createElementVNode("div", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-content`)
    }, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-title`)
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, () => [
          vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
        ])
      ], 2),
      _ctx.description || _ctx.$slots.description ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass(`${_ctx.prefixCls}-description`)
      }, [
        vue.renderSlot(_ctx.$slots, "description", {}, () => [
          vue.createTextVNode(vue.toDisplayString(_ctx.description), 1)
        ])
      ], 2)) : vue.createCommentVNode("v-if", true)
    ], 2)
  ], 2);
}
var Step = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = Step;
