import { defineComponent, toRefs, ref, reactive, resolveComponent, openBlock, createBlock, createSlots, withCtx, renderSlot, withModifiers, createCommentVNode } from "vue";
import IconHover from "../_components/icon-hover.js";
import IconEye from "../icon/icon-eye/index.js";
import IconEyeInvisible from "../icon/icon-eye-invisible/index.js";
import useMergeState from "../_hooks/use-merge-state.js";
import _Input from "./input.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "InputPassword",
  components: {
    IconEye,
    IconEyeInvisible,
    AIconHover: IconHover,
    AInput: _Input
  },
  props: {
    visibility: {
      type: Boolean,
      default: void 0
    },
    defaultVisibility: {
      type: Boolean,
      default: true
    },
    invisibleButton: {
      type: Boolean,
      default: true
    }
  },
  emits: [
    "visibility-change",
    "update:visibility"
  ],
  setup(props, { emit }) {
    const { visibility, defaultVisibility } = toRefs(props);
    const inputRef = ref();
    const handleInvisible = () => {
      setVisible(!mergedVisible.value);
    };
    const [mergedVisible, setLocalVisible] = useMergeState(
      defaultVisibility.value,
      reactive({
        value: visibility
      })
    );
    const setVisible = (newVisible) => {
      if (newVisible !== mergedVisible.value) {
        emit("visibility-change", newVisible);
        emit("update:visibility", newVisible);
        setLocalVisible(newVisible);
      }
    };
    return {
      inputRef,
      mergedVisible,
      handleInvisible
    };
  },
  methods: {
    focus() {
      var _a;
      (_a = this.inputRef) == null ? void 0 : _a.focus();
    },
    blur() {
      var _a;
      (_a = this.inputRef) == null ? void 0 : _a.blur();
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_eye = resolveComponent("icon-eye");
  const _component_icon_eye_invisible = resolveComponent("icon-eye-invisible");
  const _component_a_icon_hover = resolveComponent("a-icon-hover");
  const _component_a_input = resolveComponent("a-input");
  return openBlock(), createBlock(_component_a_input, {
    ref: "inputRef",
    type: _ctx.mergedVisible ? "password" : "text"
  }, createSlots({ _: 2 }, [
    _ctx.$slots.prepend ? {
      name: "prepend",
      fn: withCtx(() => [
        renderSlot(_ctx.$slots, "prepend")
      ]),
      key: "0"
    } : void 0,
    _ctx.$slots.prefix ? {
      name: "prefix",
      fn: withCtx(() => [
        renderSlot(_ctx.$slots, "prefix")
      ]),
      key: "1"
    } : void 0,
    _ctx.invisibleButton || _ctx.$slots.suffix ? {
      name: "suffix",
      fn: withCtx(() => [
        _ctx.invisibleButton ? (openBlock(), createBlock(_component_a_icon_hover, {
          key: 0,
          onClick: _ctx.handleInvisible,
          onMousedown: _cache[0] || (_cache[0] = withModifiers(() => {
          }, ["prevent"])),
          onMouseup: _cache[1] || (_cache[1] = withModifiers(() => {
          }, ["prevent"]))
        }, {
          default: withCtx(() => [
            !_ctx.mergedVisible ? (openBlock(), createBlock(_component_icon_eye, { key: 0 })) : (openBlock(), createBlock(_component_icon_eye_invisible, { key: 1 }))
          ]),
          _: 1
        }, 8, ["onClick"])) : createCommentVNode("v-if", true),
        renderSlot(_ctx.$slots, "suffix")
      ]),
      key: "2"
    } : void 0,
    _ctx.$slots.append ? {
      name: "append",
      fn: withCtx(() => [
        renderSlot(_ctx.$slots, "append")
      ]),
      key: "3"
    } : void 0
  ]), 1032, ["type"]);
}
var InputPassword = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { InputPassword as default };
