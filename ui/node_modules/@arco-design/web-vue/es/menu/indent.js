import { defineComponent, toRef, openBlock, createElementBlock, normalizeClass, Fragment, renderList, normalizeStyle, createCommentVNode } from "vue";
import useMenuContext from "./hooks/use-menu-context.js";
import { getPrefixCls } from "../_utils/global-config.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "MenuIndent",
  props: {
    level: {
      type: Number,
      default: 1
    }
  },
  setup() {
    const prefixCls = getPrefixCls("menu");
    const menuContext = useMenuContext();
    return {
      prefixCls,
      levelIndent: toRef(menuContext, "levelIndent")
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.level > 1 ? (openBlock(), createElementBlock("span", {
    key: 0,
    class: normalizeClass(`${_ctx.prefixCls}-indent-list`)
  }, [
    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.level - 1, (index) => {
      return openBlock(), createElementBlock("span", {
        key: index,
        class: normalizeClass(`${_ctx.prefixCls}-indent`),
        style: normalizeStyle(`width: ${_ctx.levelIndent}px`)
      }, null, 6);
    }), 128))
  ], 2)) : createCommentVNode("v-if", true);
}
var MenuIndent = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { MenuIndent as default };
