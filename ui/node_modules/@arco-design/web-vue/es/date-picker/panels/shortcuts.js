import { defineComponent, resolveComponent, openBlock, createElementBlock, normalizeClass, createBlock, withCtx, createTextVNode, toDisplayString, createCommentVNode, Fragment, renderList } from "vue";
import Button from "../../button/index.js";
import RenderFunction from "../../_components/render-function.js";
import { isFunction } from "../../_utils/is.js";
import useDatePickerTransform from "../hooks/use-inject-datepicker-transform.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "PanelShortcuts",
  components: {
    Button,
    RenderFunction
  },
  props: {
    prefixCls: {
      type: String,
      required: true
    },
    shortcuts: {
      type: Array,
      default: () => []
    },
    showNowBtn: {
      type: Boolean
    }
  },
  emits: ["item-click", "item-mouse-enter", "item-mouse-leave", "now-click"],
  setup(props, { emit }) {
    const datePickerT = useDatePickerTransform();
    return {
      datePickerT,
      onItemClick: (item) => {
        emit("item-click", item);
      },
      onItemMouseEnter: (item) => {
        emit("item-mouse-enter", item);
      },
      onItemMouseLeave: (item) => {
        emit("item-mouse-leave", item);
      },
      onNowClick: () => {
        emit("now-click");
      },
      isFunction
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Button = resolveComponent("Button");
  const _component_RenderFunction = resolveComponent("RenderFunction");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(`${_ctx.prefixCls}-shortcuts`)
  }, [
    _ctx.showNowBtn ? (openBlock(), createBlock(_component_Button, {
      key: 0,
      size: "mini",
      onClick: _cache[0] || (_cache[0] = () => _ctx.onNowClick())
    }, {
      default: withCtx(() => [
        createTextVNode(toDisplayString(_ctx.datePickerT("datePicker.now")), 1)
      ]),
      _: 1
    })) : createCommentVNode("v-if", true),
    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.shortcuts, (item, index) => {
      return openBlock(), createBlock(_component_Button, {
        key: index,
        size: "mini",
        onClick: () => _ctx.onItemClick(item),
        onMouseenter: () => _ctx.onItemMouseEnter(item),
        onMouseleave: () => _ctx.onItemMouseLeave(item)
      }, {
        default: withCtx(() => [
          _ctx.isFunction(item.label) ? (openBlock(), createBlock(_component_RenderFunction, {
            key: 0,
            "render-func": item.label
          }, null, 8, ["render-func"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            createTextVNode(toDisplayString(item.label), 1)
          ], 64))
        ]),
        _: 2
      }, 1032, ["onClick", "onMouseenter", "onMouseleave"]);
    }), 128))
  ], 2);
}
var PanelShortcuts = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { PanelShortcuts as default };
