import { defineComponent, toRefs, inject, getCurrentInstance, ref, watch, computed, onMounted, onUpdated, reactive, onBeforeUnmount, resolveComponent, withDirectives, openBlock, createBlock, resolveDynamicComponent, normalizeClass, withCtx, createElementBlock, renderSlot, createCommentVNode, createTextVNode, toDisplayString, vShow } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import Checkbox from "../checkbox/index.js";
import { selectInjectionKey } from "./context.js";
import { getKeyFromValue, isValidOption } from "./utils.js";
import { isEqual } from "../_utils/is-equal.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Option",
  components: {
    Checkbox
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
    const { disabled, tagProps: _tagProps, index } = toRefs(props);
    const prefixCls = getPrefixCls("select-option");
    const selectCtx = inject(selectInjectionKey, void 0);
    const instance = getCurrentInstance();
    const itemRef = ref();
    const tagProps = ref(_tagProps.value);
    watch(_tagProps, (cur, pre) => {
      if (!isEqual(cur, pre)) {
        tagProps.value = cur;
      }
    });
    const textContent = ref("");
    const value = computed(
      () => {
        var _a, _b;
        return (_b = (_a = props.value) != null ? _a : props.label) != null ? _b : textContent.value;
      }
    );
    const label = computed(() => {
      var _a;
      return (_a = props.label) != null ? _a : textContent.value;
    });
    const key = computed(
      () => getKeyFromValue(value.value, selectCtx == null ? void 0 : selectCtx.valueKey)
    );
    const component = computed(() => {
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
    onMounted(() => setTextContent());
    onUpdated(() => setTextContent());
    const isSelected = computed(
      () => {
        var _a;
        return (_a = selectCtx == null ? void 0 : selectCtx.valueKeys.includes(key.value)) != null ? _a : false;
      }
    );
    const isActive = computed(
      () => (selectCtx == null ? void 0 : selectCtx.activeKey) === key.value
    );
    let isValid = ref(true);
    if (!props.internal) {
      const optionInfo = reactive({
        raw: {
          value,
          label,
          disabled,
          tagProps
        },
        ref: itemRef,
        index,
        key,
        origin: "slot",
        value,
        label,
        disabled,
        tagProps
      });
      isValid = computed(
        () => isValidOption(optionInfo, {
          inputValue: selectCtx == null ? void 0 : selectCtx.inputValue,
          filterOption: selectCtx == null ? void 0 : selectCtx.filterOption
        })
      );
      if (instance) {
        selectCtx == null ? void 0 : selectCtx.addSlotOptionInfo(instance.uid, optionInfo);
      }
      onBeforeUnmount(() => {
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
    const cls = computed(() => [
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
  const _component_checkbox = resolveComponent("checkbox");
  return withDirectives((openBlock(), createBlock(resolveDynamicComponent(_ctx.component), {
    ref: "itemRef",
    class: normalizeClass([_ctx.cls, { [`${_ctx.prefixCls}-has-suffix`]: Boolean(_ctx.$slots.suffix) }]),
    onClick: _ctx.handleClick,
    onMouseenter: _ctx.handleMouseEnter,
    onMouseleave: _ctx.handleMouseLeave
  }, {
    default: withCtx(() => [
      _ctx.$slots.icon ? (openBlock(), createElementBlock("span", {
        key: 0,
        class: normalizeClass(`${_ctx.prefixCls}-icon`)
      }, [
        renderSlot(_ctx.$slots, "icon")
      ], 2)) : createCommentVNode("v-if", true),
      _ctx.selectCtx && _ctx.selectCtx.multiple ? (openBlock(), createBlock(_component_checkbox, {
        key: 1,
        class: normalizeClass(`${_ctx.prefixCls}-checkbox`),
        "model-value": _ctx.isSelected,
        disabled: _ctx.disabled,
        "uninject-group-context": ""
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default", {}, () => [
            createTextVNode(toDisplayString(_ctx.label), 1)
          ])
        ]),
        _: 3
      }, 8, ["class", "model-value", "disabled"])) : (openBlock(), createElementBlock("span", {
        key: 2,
        class: normalizeClass(`${_ctx.prefixCls}-content`)
      }, [
        renderSlot(_ctx.$slots, "default", {}, () => [
          createTextVNode(toDisplayString(_ctx.label), 1)
        ])
      ], 2)),
      _ctx.$slots.suffix ? (openBlock(), createElementBlock("span", {
        key: 3,
        class: normalizeClass(`${_ctx.prefixCls}-suffix`)
      }, [
        renderSlot(_ctx.$slots, "suffix")
      ], 2)) : createCommentVNode("v-if", true)
    ]),
    _: 3
  }, 40, ["class", "onClick", "onMouseenter", "onMouseleave"])), [
    [vShow, _ctx.isValid]
  ]);
}
var Option = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Option as default };
