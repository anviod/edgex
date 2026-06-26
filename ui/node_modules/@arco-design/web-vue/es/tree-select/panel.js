import { defineComponent, toRefs, ref, computed, createVNode, mergeProps, isVNode } from "vue";
import Tree from "../tree/index.js";
import { useScrollbar } from "../_hooks/use-scrollbar.js";
import "../arco-vue.js";
import "../locale/index.js";
import "../affix/index.js";
import "../alert/index.js";
import "../anchor/index.js";
import "../auto-complete/index.js";
import "../avatar/index.js";
import "../back-top/index.js";
import "../badge/index.js";
import "../breadcrumb/index.js";
import "../button/index.js";
import "../card/index.js";
import "../calendar/index.js";
import "../carousel/index.js";
import "../cascader/index.js";
import "../checkbox/index.js";
import "../collapse/index.js";
import "../comment/index.js";
import "../color-picker/index.js";
import "../config-provider/index.js";
import "../date-picker/index.js";
import "../descriptions/index.js";
import "../divider/index.js";
import "../drawer/index.js";
import "../dropdown/index.js";
import "../empty/index.js";
import "../form/index.js";
import "../grid/index.js";
import "../icon-component/index.js";
import "../image/index.js";
import "../input/index.js";
import "../input-number/index.js";
import "../input-tag/index.js";
import "../layout/index.js";
import "../link/index.js";
import "../list/index.js";
import "../mention/index.js";
import "../menu/index.js";
import "../message/index.js";
import "../modal/index.js";
import "../notification/index.js";
import "../page-header/index.js";
import "../pagination/index.js";
import "../popconfirm/index.js";
import "../popover/index.js";
import "../progress/index.js";
import "../radio/index.js";
import "../rate/index.js";
import "../resize-box/index.js";
import "../result/index.js";
import Scrollbar from "../scrollbar/index.js";
import "../select/index.js";
import "../skeleton/index.js";
import "../slider/index.js";
import "../space/index.js";
import "../spin/index.js";
import "../split/index.js";
import "../statistic/index.js";
import "../steps/index.js";
import "../switch/index.js";
import "../table/index.js";
import "../tabs/index.js";
import "../tag/index.js";
import "../textarea/index.js";
import "../time-picker/index.js";
import "../timeline/index.js";
import "../tooltip/index.js";
import "../transfer/index.js";
import "./index.js";
import "../trigger/index.js";
import "../typography/index.js";
import "../upload/index.js";
import "../overflow-list/index.js";
import "../verification-code/index.js";
import "../watermark/index.js";
import { getPrefixCls } from "../_utils/global-config.js";
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
var Panel = defineComponent({
  name: "TreeSelectPanel",
  components: {
    Tree
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
    } = toRefs(props);
    const {
      displayScrollbar,
      scrollbarProps
    } = useScrollbar(scrollbar);
    const prefixCls = getPrefixCls("tree-select");
    const refTree = ref();
    const computedTreeProps = computed(() => {
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
      return createVNode(Tree, mergeProps({
        "ref": refTree
      }, computedTreeProps.value, {
        "onSelect": onSelect,
        "onCheck": onCheck
      }), props.treeSlots);
    };
    return () => {
      if (displayScrollbar.value) {
        let _slot;
        return createVNode(Scrollbar, mergeProps({
          "class": `${prefixCls}-tree-wrapper`
        }, scrollbarProps.value), _isSlot(_slot = renderTree()) ? _slot : {
          default: () => [_slot]
        });
      }
      return createVNode("div", {
        "class": `${prefixCls}-tree-wrapper`
      }, [renderTree()]);
    };
  }
});
export { Panel as default };
