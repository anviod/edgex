"use strict";
var vue = require("vue");
var is = require("../_utils/is.js");
var index = require("./utils/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
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
    const { visible, value } = vue.toRefs(props);
    const refMap = vue.ref(/* @__PURE__ */ new Map());
    const refWrapper = vue.ref();
    function scrollToTop(easing = false) {
      if (!refWrapper.value || is.isUndefined(value == null ? void 0 : value.value) || !(visible == null ? void 0 : visible.value)) {
        return;
      }
      const refSelected = refMap.value.get(value.value);
      if (refSelected) {
        index.scrollTo(refWrapper.value, refSelected.offsetTop, easing ? 100 : 0);
      }
    }
    vue.watch([value, visible], (_, [, preVisible]) => {
      if (visible.value !== preVisible) {
        vue.nextTick(() => {
          scrollToTop();
        });
      } else {
        scrollToTop(true);
      }
    });
    vue.onMounted(() => {
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
  return vue.openBlock(), vue.createElementBlock("div", {
    ref: "refWrapper",
    class: vue.normalizeClass(`${_ctx.prefixCls}-column`)
  }, [
    vue.createElementVNode("ul", null, [
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.list, (item) => {
        return vue.openBlock(), vue.createElementBlock("li", {
          key: item.value,
          ref_for: true,
          ref: (el) => {
            _ctx.onItemRef(el, item);
          },
          class: vue.normalizeClass([
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
          vue.createElementVNode("div", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-cell-inner`)
          }, vue.toDisplayString(item.label), 3)
        ], 10, _hoisted_1);
      }), 128))
    ])
  ], 2);
}
var TimeColumn = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = TimeColumn;
