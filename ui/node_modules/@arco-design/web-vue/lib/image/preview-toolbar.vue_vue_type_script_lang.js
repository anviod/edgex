"use strict";
var vue = require("vue");
var renderFunction = require("../_components/render-function.js");
var globalConfig = require("../_utils/global-config.js");
var previewAction = require("./preview-action.js");
var _sfc_main = vue.defineComponent({
  name: "ImagePreviewToolbar",
  components: {
    RenderFunction: renderFunction,
    PreviewAction: previewAction
  },
  props: {
    actions: {
      type: Array,
      default: () => []
    },
    actionsLayout: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const {
      actions,
      actionsLayout
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("image-preview-toolbar");
    const resultActions = vue.computed(() => {
      const actionsLayoutSet = new Set(actionsLayout.value);
      const filterWithLayout = (item) => actionsLayoutSet.has(item.key);
      const filteredActions = actions.value.filter(filterWithLayout);
      return filteredActions.sort((pre, cur) => {
        const preIndex = actionsLayout.value.indexOf(pre.key);
        const curIndex = actionsLayout.value.indexOf(cur.key);
        return preIndex > curIndex ? 1 : -1;
      });
    });
    return {
      prefixCls,
      resultActions
    };
  }
});
module.exports = _sfc_main;
