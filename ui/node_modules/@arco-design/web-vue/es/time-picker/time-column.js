import { defineComponent, toRefs, ref, watch, nextTick, onMounted, openBlock, createElementBlock, normalizeClass, createElementVNode, Fragment, renderList, toDisplayString } from "vue";
import { isUndefined } from "../_utils/is.js";
import { scrollTo } from "./utils/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "TimePickerColumn",
  props: {
    prefixCls: {
      type: String,
      required: true
    },
    list: {
      type: Array,
      required: true
    },
    value: {
      type: [Number, String]
    },
    visible: {
      type: Boolean
    }
  },
  emits: ["select"],
  setup(props, { emit }) {
    const { visible, value } = toRefs(props);
    const refMap = ref(/* @__PURE__ */ new Map());
    const refWrapper = ref();
    function scrollToTop(easing = false) {
      if (!refWrapper.value || isUndefined(value == null ? void 0 : value.value) || !(visible == null ? void 0 : visible.value)) {
        return;
      }
      const refSelected = refMap.value.get(value.value);
      if (refSelected) {
        scrollTo(refWrapper.value, refSelected.offsetTop, easing ? 100 : 0);
      }
    }
    watch([value, visible], (_, [, preVisible]) => {
      if (visible.value !== preVisible) {
        nextTick(() => {
          scrollToTop();
        });
      } else {
        scrollToTop(true);
      }
    });
    onMounted(() => {
      scrollToTop();
    });
    return {
      refWrapper,
      refMap,
      onItemRef(el, item) {
        refMap.value.set(item.value, el);
      },
      onItemClick(item) {
        if (!item.disabled) {
          emit("select", item.value);
        }
      }
    };
  }
});
const _hoisted_1 = ["onClick"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    ref: "refWrapper",
    class: normalizeClass(`${_ctx.prefixCls}-column`)
  }, [
    createElementVNode("ul", null, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.list, (item) => {
        return openBlock(), createElementBlock("li", {
          key: item.value,
          ref_for: true,
          ref: (el) => {
            _ctx.onItemRef(el, item);
          },
          class: normalizeClass([
            `${_ctx.prefixCls}-cell`,
            {
              [`${_ctx.prefixCls}-cell-disabled`]: item.disabled,
              [`${_ctx.prefixCls}-cell-selected`]: item.selected
            }
          ]),
          onClick: () => {
            _ctx.onItemClick(item);
          }
        }, [
          createElementVNode("div", {
            class: normalizeClass(`${_ctx.prefixCls}-cell-inner`)
          }, toDisplayString(item.label), 3)
        ], 10, _hoisted_1);
      }), 128))
    ])
  ], 2);
}
var TimeColumn = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { TimeColumn as default };
