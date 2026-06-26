import { defineComponent, toRefs, h } from "vue";
import RenderFunction from "../_components/render-function.js";
import IconLoading from "../icon/icon-loading/index.js";
import IconHover from "../_components/icon-hover.js";
import IconCaretDown from "../icon/icon-caret-down/index.js";
import IconFile from "../icon/icon-file/index.js";
import useTreeContext from "./hooks/use-tree-context.js";
import usePickSlots from "../_hooks/use-pick-slots.js";
var _sfc_main = defineComponent({
  name: "TreeNodeSwitcher",
  components: {
    IconLoading,
    RenderFunction
  },
  props: {
    prefixCls: String,
    loading: Boolean,
    showLine: Boolean,
    treeNodeData: {
      type: Object
    },
    icons: {
      type: Object
    },
    nodeStatus: {
      type: Object
    }
  },
  emits: ["click"],
  setup(props, {
    slots,
    emit
  }) {
    const {
      icons,
      nodeStatus,
      treeNodeData
    } = toRefs(props);
    const treeContext = useTreeContext();
    const nodeSwitcherIcon = usePickSlots(slots, "switcher-icon");
    const nodeLoadingIcon = usePickSlots(slots, "loading-icon");
    return {
      getSwitcherIcon: () => {
        var _a, _b, _c;
        const icon = (_b = (_a = icons == null ? void 0 : icons.value) == null ? void 0 : _a.switcherIcon) != null ? _b : nodeSwitcherIcon.value;
        return icon ? icon(nodeStatus.value) : (_c = treeContext.switcherIcon) == null ? void 0 : _c.call(treeContext, treeNodeData.value, nodeStatus.value);
      },
      getLoadingIcon: () => {
        var _a, _b, _c;
        const icon = (_b = (_a = icons == null ? void 0 : icons.value) == null ? void 0 : _a.loadingIcon) != null ? _b : nodeLoadingIcon.value;
        return icon ? icon(nodeStatus.value) : (_c = treeContext.loadingIcon) == null ? void 0 : _c.call(treeContext, treeNodeData.value, nodeStatus.value);
      },
      onClick(e) {
        emit("click", e);
      }
    };
  },
  render() {
    var _a, _b, _c;
    const {
      prefixCls,
      getSwitcherIcon,
      getLoadingIcon,
      onClick,
      nodeStatus = {},
      loading,
      showLine
    } = this;
    const {
      expanded,
      isLeaf
    } = nodeStatus;
    if (loading) {
      return (_a = getLoadingIcon()) != null ? _a : h(IconLoading);
    }
    let icon = null;
    let needIconHover = false;
    if (!isLeaf) {
      const defaultIcon = showLine ? h("span", {
        class: `${prefixCls}-${expanded ? "minus" : "plus"}-icon`
      }) : h(IconCaretDown);
      icon = (_b = getSwitcherIcon()) != null ? _b : defaultIcon;
      needIconHover = !showLine;
    } else if (showLine) {
      icon = (_c = getSwitcherIcon()) != null ? _c : h(IconFile);
    }
    if (!icon)
      return null;
    const content = h("span", {
      class: `${prefixCls}-switcher-icon`,
      onClick
    }, icon);
    return needIconHover ? h(IconHover, {
      class: `${prefixCls}-icon-hover`
    }, () => content) : content;
  }
});
export { _sfc_main as default };
