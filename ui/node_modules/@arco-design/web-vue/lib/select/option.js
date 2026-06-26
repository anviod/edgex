"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../checkbox/index.js");
var context = require("./context.js");
var utils = require("./utils.js");
var isEqual = require("../_utils/is-equal.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Option",
  components: {
    Checkbox: index["default"]
  },
  props: {
    value: {
      type: [String, Number, Boolean, Object],
      default: void 0
    },
    label: String,
    disabled: Boolean,
    tagProps: {
      type: Object
    },
    extra: {
      type: Object
    },
    index: {
      type: Number
    },
    internal: Boolean
  },
  setup(props) {
    const { disabled, tagProps: _tagProps, index: index2 } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("select-option");
    const selectCtx = vue.inject(context.selectInjectionKey, void 0);
    const instance = vue.getCurrentInstance();
    const itemRef = vue.ref();
    const tagProps = vue.ref(_tagProps.value);
    vue.watch(_tagProps, (cur, pre) => {
      if (!isEqual.isEqual(cur, pre)) {
        tagProps.value = cur;
      }
    });
    const textContent = vue.ref("");
    const value = vue.computed(
      () => {
        var _a, _b;
        return (_b = (_a = props.value) != null ? _a : props.label) != null ? _b : textContent.value;
      }
    );
    const label = vue.computed(() => {
      var _a;
      return (_a = props.label) != null ? _a : textContent.value;
    });
    const key = vue.computed(
      () => utils.getKeyFromValue(value.value, selectCtx == null ? void 0 : selectCtx.valueKey)
    );
    const component = vue.computed(() => {
      var _a;
      return (_a = selectCtx == null ? void 0 : selectCtx.component) != null ? _a : "li";
    });
    const setTextContent = () => {
      var _a;
      if (!props.label && itemRef.value) {
        const text = (_a = itemRef.value.textContent) != null ? _a : "";
        if (textContent.value !== text) {
          textContent.value = text;
        }
      }
    };
    vue.onMounted(() => setTextContent());
    vue.onUpdated(() => setTextContent());
    const isSelected = vue.computed(
      () => {
        var _a;
        return (_a = selectCtx == null ? void 0 : selectCtx.valueKeys.includes(key.value)) != null ? _a : false;
      }
    );
    const isActive = vue.computed(
      () => (selectCtx == null ? void 0 : selectCtx.activeKey) === key.value
    );
    let isValid = vue.ref(true);
    if (!props.internal) {
      const optionInfo = vue.reactive({
        raw: {
          value,
          label,
          disabled,
          tagProps
        },
        ref: itemRef,
        index: index2,
        key,
        origin: "slot",
        value,
        label,
        disabled,
        tagProps
      });
      isValid = vue.computed(
        () => utils.isValidOption(optionInfo, {
          inputValue: selectCtx == null ? void 0 : selectCtx.inputValue,
          filterOption: selectCtx == null ? void 0 : selectCtx.filterOption
        })
      );
      if (instance) {
        selectCtx == null ? void 0 : selectCtx.addSlotOptionInfo(instance.uid, optionInfo);
      }
      vue.onBeforeUnmount(() => {
        if (instance) {
          selectCtx == null ? void 0 : selectCtx.removeSlotOptionInfo(instance.uid);
        }
      });
    }
    const handleClick = (ev) => {
      if (!props.disabled) {
        selectCtx == null ? void 0 : selectCtx.onSelect(key.value, ev);
      }
    };
    const handleMouseEnter = () => {
      if (!props.disabled) {
        selectCtx == null ? void 0 : selectCtx.setActiveKey(key.value);
      }
    };
    const handleMouseLeave = () => {
      if (!props.disabled) {
        selectCtx == null ? void 0 : selectCtx.setActiveKey();
      }
    };
    const cls = vue.computed(() => [
      prefixCls,
      {
        [`${prefixCls}-disabled`]: props.disabled,
        [`${prefixCls}-selected`]: isSelected.value,
        [`${prefixCls}-active`]: isActive.value,
        [`${prefixCls}-multiple`]: selectCtx == null ? void 0 : selectCtx.multiple
      }
    ]);
    return {
      prefixCls,
      cls,
      selectCtx,
      itemRef,
      component,
      isSelected,
      isValid,
      handleClick,
      handleMouseEnter,
      handleMouseLeave
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_checkbox = vue.resolveComponent("checkbox");
  return vue.withDirectives((vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.component), {
    ref: "itemRef",
    class: vue.normalizeClass([_ctx.cls, { [`${_ctx.prefixCls}-has-suffix`]: Boolean(_ctx.$slots.suffix) }]),
    onClick: _ctx.handleClick,
    onMouseenter: _ctx.handleMouseEnter,
    onMouseleave: _ctx.handleMouseLeave
  }, {
    default: vue.withCtx(() => [
      _ctx.$slots.icon ? (vue.openBlock(), vue.createElementBlock("span", {
        key: 0,
        class: vue.normalizeClass(`${_ctx.prefixCls}-icon`)
      }, [
        vue.renderSlot(_ctx.$slots, "icon")
      ], 2)) : vue.createCommentVNode("v-if", true),
      _ctx.selectCtx && _ctx.selectCtx.multiple ? (vue.openBlock(), vue.createBlock(_component_checkbox, {
        key: 1,
        class: vue.normalizeClass(`${_ctx.prefixCls}-checkbox`),
        "model-value": _ctx.isSelected,
        disabled: _ctx.disabled,
        "uninject-group-context": ""
      }, {
        default: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "default", {}, () => [
            vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
          ])
        ]),
        _: 3
      }, 8, ["class", "model-value", "disabled"])) : (vue.openBlock(), vue.createElementBlock("span", {
        key: 2,
        class: vue.normalizeClass(`${_ctx.prefixCls}-content`)
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, () => [
          vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
        ])
      ], 2)),
      _ctx.$slots.suffix ? (vue.openBlock(), vue.createElementBlock("span", {
        key: 3,
        class: vue.normalizeClass(`${_ctx.prefixCls}-suffix`)
      }, [
        vue.renderSlot(_ctx.$slots, "suffix")
      ], 2)) : vue.createCommentVNode("v-if", true)
    ]),
    _: 3
  }, 40, ["class", "onClick", "onMouseenter", "onMouseleave"])), [
    [vue.vShow, _ctx.isValid]
  ]);
}
var Option = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = Option;
