import { defineComponent, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconLeft from "../icon/icon-left/index.js";
import IconRight from "../icon/icon-right/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "ImagePreviewArrow",
  components: {
    IconLeft,
    IconRight
  },
  props: {
    onPrev: {
      type: Function
    },
    onNext: {
      type: Function
    }
  },
  setup() {
    const prefixCls = getPrefixCls("image-preview-arrow");
    return {
      prefixCls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_left = resolveComponent("icon-left");
  const _component_icon_right = resolveComponent("icon-right");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.prefixCls)
  }, [
    createElementVNode("div", {
      class: normalizeClass([
        `${_ctx.prefixCls}-left`,
        {
          [`${_ctx.prefixCls}-disabled`]: !_ctx.onPrev
        }
      ]),
      onClick: _cache[0] || (_cache[0] = (e) => {
        e.preventDefault();
        _ctx.onPrev && _ctx.onPrev();
      })
    }, [
      createVNode(_component_icon_left)
    ], 2),
    createElementVNode("div", {
      class: normalizeClass([
        `${_ctx.prefixCls}-right`,
        {
          [`${_ctx.prefixCls}-disabled`]: !_ctx.onNext
        }
      ]),
      onClick: _cache[1] || (_cache[1] = (e) => {
        e.preventDefault();
        _ctx.onNext && _ctx.onNext();
      })
    }, [
      createVNode(_component_icon_right)
    ], 2)
  ], 2);
}
var PreviewArrow = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { PreviewArrow as default };
