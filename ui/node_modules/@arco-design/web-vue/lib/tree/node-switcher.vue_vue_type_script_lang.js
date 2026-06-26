"use strict";
var vue = require("vue");
var renderFunction = require("../_components/render-function.js");
var index = require("../icon/icon-loading/index.js");
var iconHover = require("../_components/icon-hover.js");
var index$1 = require("../icon/icon-caret-down/index.js");
var index$2 = require("../icon/icon-file/index.js");
var useTreeContext = require("./hooks/use-tree-context.js");
var usePickSlots = require("../_hooks/use-pick-slots.js");
var _sfc_main = vue.defineComponent({
  name: "TreeNodeSwitcher",
  components: {
    IconLoading: index,
    RenderFunction: renderFunction
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
    } = vue.toRefs(props);
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
      return (_a = getLoadingIcon()) != null ? _a : vue.h(index);
    }
    let icon = null;
    let needIconHover = false;
    if (!isLeaf) {
      const defaultIcon = showLine ? vue.h("span", {
        class: `${prefixCls}-${expanded ? "minus" : "plus"}-icon`
      }) : vue.h(index$1);
      icon = (_b = getSwitcherIcon()) != null ? _b : defaultIcon;
      needIconHover = !showLine;
    } else if (showLine) {
      icon = (_c = getSwitcherIcon()) != null ? _c : vue.h(index$2);
    }
    if (!icon)
      return null;
    const content = vue.h("span", {
      class: `${prefixCls}-switcher-icon`,
      onClick
    }, icon);
    return needIconHover ? vue.h(iconHover, {
      class: `${prefixCls}-icon-hover`
    }, () => content) : content;
  }
});
module.exports = _sfc_main;
