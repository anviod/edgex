"use strict";
var vue = require("vue");
var index = require("../tree/index.js");
var useScrollbar = require("../_hooks/use-scrollbar.js");
require("../arco-vue.js");
require("../locale/index.js");
require("../affix/index.js");
require("../alert/index.js");
require("../anchor/index.js");
require("../auto-complete/index.js");
require("../avatar/index.js");
require("../back-top/index.js");
require("../badge/index.js");
require("../breadcrumb/index.js");
require("../button/index.js");
require("../card/index.js");
require("../calendar/index.js");
require("../carousel/index.js");
require("../cascader/index.js");
require("../checkbox/index.js");
require("../collapse/index.js");
require("../comment/index.js");
require("../color-picker/index.js");
require("../config-provider/index.js");
require("../date-picker/index.js");
require("../descriptions/index.js");
require("../divider/index.js");
require("../drawer/index.js");
require("../dropdown/index.js");
require("../empty/index.js");
require("../form/index.js");
require("../grid/index.js");
require("../icon-component/index.js");
require("../image/index.js");
require("../input/index.js");
require("../input-number/index.js");
require("../input-tag/index.js");
require("../layout/index.js");
require("../link/index.js");
require("../list/index.js");
require("../mention/index.js");
require("../menu/index.js");
require("../message/index.js");
require("../modal/index.js");
require("../notification/index.js");
require("../page-header/index.js");
require("../pagination/index.js");
require("../popconfirm/index.js");
require("../popover/index.js");
require("../progress/index.js");
require("../radio/index.js");
require("../rate/index.js");
require("../resize-box/index.js");
require("../result/index.js");
var index$1 = require("../scrollbar/index.js");
require("../select/index.js");
require("../skeleton/index.js");
require("../slider/index.js");
require("../space/index.js");
require("../spin/index.js");
require("../split/index.js");
require("../statistic/index.js");
require("../steps/index.js");
require("../switch/index.js");
require("../table/index.js");
require("../tabs/index.js");
require("../tag/index.js");
require("../textarea/index.js");
require("../time-picker/index.js");
require("../timeline/index.js");
require("../tooltip/index.js");
require("../transfer/index.js");
require("./index.js");
require("../trigger/index.js");
require("../typography/index.js");
require("../upload/index.js");
require("../overflow-list/index.js");
require("../verification-code/index.js");
require("../watermark/index.js");
var globalConfig = require("../_utils/global-config.js");
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
var Panel = vue.defineComponent({
  name: "TreeSelectPanel",
  components: {
    Tree: index
  },
  props: {
    treeProps: {
      type: Object,
      default: () => ({})
    },
    selectedKeys: {
      type: Array
    },
    showCheckable: {
      type: Boolean
    },
    treeSlots: {
      type: Object,
      default: () => ({})
    },
    scrollbar: {
      type: [Boolean, Object],
      default: true
    }
  },
  emits: ["change"],
  setup(props, {
    emit
  }) {
    const {
      showCheckable,
      selectedKeys,
      treeProps,
      scrollbar
    } = vue.toRefs(props);
    const {
      displayScrollbar,
      scrollbarProps
    } = useScrollbar.useScrollbar(scrollbar);
    const prefixCls = globalConfig.getPrefixCls("tree-select");
    const refTree = vue.ref();
    const computedTreeProps = vue.computed(() => {
      return {
        ...treeProps.value,
        disableSelectActionOnly: true,
        checkedKeys: showCheckable.value ? selectedKeys.value : [],
        selectedKeys: showCheckable.value ? [] : selectedKeys.value
      };
    });
    const onSelect = (newVal, e) => {
      var _a, _b;
      if (showCheckable.value) {
        (_b = (_a = refTree.value) == null ? void 0 : _a.toggleCheck) == null ? void 0 : _b.call(_a, newVal[0], e);
      } else {
        emit("change", newVal);
      }
    };
    const onCheck = (newVal) => {
      emit("change", newVal);
    };
    const renderTree = () => {
      return vue.createVNode(index, vue.mergeProps({
        "ref": refTree
      }, computedTreeProps.value, {
        "onSelect": onSelect,
        "onCheck": onCheck
      }), props.treeSlots);
    };
    return () => {
      if (displayScrollbar.value) {
        let _slot;
        return vue.createVNode(index$1, vue.mergeProps({
          "class": `${prefixCls}-tree-wrapper`
        }, scrollbarProps.value), _isSlot(_slot = renderTree()) ? _slot : {
          default: () => [_slot]
        });
      }
      return vue.createVNode("div", {
        "class": `${prefixCls}-tree-wrapper`
      }, [renderTree()]);
    };
  }
});
module.exports = Panel;
