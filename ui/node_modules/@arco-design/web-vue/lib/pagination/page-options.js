"use strict";
var vue = require("vue");
var index$1 = require("../locale/index.js");
var globalConfig = require("../_utils/global-config.js");
var index = require("../select/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "PageOptions",
  components: {
    ArcoSelect: index["default"]
  },
  props: {
    sizeOptions: {
      type: Array,
      required: true
    },
    pageSize: Number,
    disabled: Boolean,
    size: {
      type: String
    },
    onChange: {
      type: Function
    },
    selectProps: {
      type: Object
    }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const prefixCls = globalConfig.getPrefixCls("pagination-options");
    const { t } = index$1.useI18n();
    const options = vue.computed(
      () => props.sizeOptions.map((value) => ({
        value,
        label: `${value} ${t("pagination.countPerPage")}`
      }))
    );
    const handleChange = (value) => {
      emit("change", value);
    };
    return {
      prefixCls,
      options,
      handleChange
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_arco_select = vue.resolveComponent("arco-select");
  return vue.openBlock(), vue.createElementBlock("span", {
    class: vue.normalizeClass(_ctx.prefixCls)
  }, [
    vue.createVNode(_component_arco_select, vue.mergeProps({
      "model-value": _ctx.pageSize,
      options: _ctx.options,
      size: _ctx.size,
      disabled: _ctx.disabled
    }, _ctx.selectProps, { onChange: _ctx.handleChange }), null, 16, ["model-value", "options", "size", "disabled", "onChange"])
  ], 2);
}
var PageOptions = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = PageOptions;
