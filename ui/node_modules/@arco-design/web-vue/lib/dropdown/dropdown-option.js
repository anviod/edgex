"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var context = require("./context.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Doption",
  props: {
    value: {
      type: [String, Number, Object]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    active: Boolean,
    uninjectContext: Boolean
  },
  emits: {
    click: (ev) => true
  },
  setup(props, { emit }) {
    const prefixCls = globalConfig.getPrefixCls("dropdown-option");
    const liRef = vue.ref();
    const computedValue = vue.computed(
      () => {
        var _a, _b, _c;
        return (_c = (_b = props.value) != null ? _b : (_a = liRef.value) == null ? void 0 : _a.textContent) != null ? _c : void 0;
      }
    );
    const dropdownCtx = !props.uninjectContext ? vue.inject(context.dropdownInjectionKey, void 0) : void 0;
    const handleClick = (ev) => {
      if (!props.disabled) {
        emit("click", ev);
        dropdownCtx == null ? void 0 : dropdownCtx.onOptionClick(computedValue.value, ev);
      }
    };
    const cls = vue.computed(() => [
      prefixCls,
      {
        [`${prefixCls}-disabled`]: props.disabled,
        [`${prefixCls}-active`]: props.active
      }
    ]);
    return {
      prefixCls,
      cls,
      liRef,
      handleClick
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("li", {
    ref: "liRef",
    class: vue.normalizeClass([_ctx.cls, { [`${_ctx.prefixCls}-has-suffix`]: Boolean(_ctx.$slots.suffix) }]),
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
  }, [
    _ctx.$slots.icon ? (vue.openBlock(), vue.createElementBlock("span", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-icon`)
    }, [
      vue.renderSlot(_ctx.$slots, "icon")
    ], 2)) : vue.createCommentVNode("v-if", true),
    vue.createElementVNode("span", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-content`)
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 2),
    _ctx.$slots.suffix ? (vue.openBlock(), vue.createElementBlock("span", {
      key: 1,
      class: vue.normalizeClass(`${_ctx.prefixCls}-suffix`)
    }, [
      vue.renderSlot(_ctx.$slots, "suffix")
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 2);
}
var Doption = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = Doption;
