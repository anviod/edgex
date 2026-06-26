"use strict";
var vue = require("vue");
var iconHover = require("../_components/icon-hover.js");
var index = require("../icon/icon-eye/index.js");
var index$1 = require("../icon/icon-eye-invisible/index.js");
var useMergeState = require("../_hooks/use-merge-state.js");
var input = require("./input.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "InputPassword",
  components: {
    IconEye: index,
    IconEyeInvisible: index$1,
    AIconHover: iconHover,
    AInput: input
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
    const { visibility, defaultVisibility } = vue.toRefs(props);
    const inputRef = vue.ref();
    const handleInvisible = () => {
      setVisible(!mergedVisible.value);
    };
    const [mergedVisible, setLocalVisible] = useMergeState(
      defaultVisibility.value,
      vue.reactive({
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
  const _component_icon_eye = vue.resolveComponent("icon-eye");
  const _component_icon_eye_invisible = vue.resolveComponent("icon-eye-invisible");
  const _component_a_icon_hover = vue.resolveComponent("a-icon-hover");
  const _component_a_input = vue.resolveComponent("a-input");
  return vue.openBlock(), vue.createBlock(_component_a_input, {
    ref: "inputRef",
    type: _ctx.mergedVisible ? "password" : "text"
  }, vue.createSlots({ _: 2 }, [
    _ctx.$slots.prepend ? {
      name: "prepend",
      fn: vue.withCtx(() => [
        vue.renderSlot(_ctx.$slots, "prepend")
      ]),
      key: "0"
    } : void 0,
    _ctx.$slots.prefix ? {
      name: "prefix",
      fn: vue.withCtx(() => [
        vue.renderSlot(_ctx.$slots, "prefix")
      ]),
      key: "1"
    } : void 0,
    _ctx.invisibleButton || _ctx.$slots.suffix ? {
      name: "suffix",
      fn: vue.withCtx(() => [
        _ctx.invisibleButton ? (vue.openBlock(), vue.createBlock(_component_a_icon_hover, {
          key: 0,
          onClick: _ctx.handleInvisible,
          onMousedown: _cache[0] || (_cache[0] = vue.withModifiers(() => {
          }, ["prevent"])),
          onMouseup: _cache[1] || (_cache[1] = vue.withModifiers(() => {
          }, ["prevent"]))
        }, {
          default: vue.withCtx(() => [
            !_ctx.mergedVisible ? (vue.openBlock(), vue.createBlock(_component_icon_eye, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_icon_eye_invisible, { key: 1 }))
          ]),
          _: 1
        }, 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
        vue.renderSlot(_ctx.$slots, "suffix")
      ]),
      key: "2"
    } : void 0,
    _ctx.$slots.append ? {
      name: "append",
      fn: vue.withCtx(() => [
        vue.renderSlot(_ctx.$slots, "append")
      ]),
      key: "3"
    } : void 0
  ]), 1032, ["type"]);
}
var InputPassword = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = InputPassword;
