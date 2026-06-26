import { defineComponent, toRefs, computed, reactive, ref, provide, resolveComponent, openBlock, createElementBlock, normalizeClass, createBlock, mergeProps, withCtx, Fragment, renderList } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { TreeInjectionKey } from "./context.js";
import usePickSlots from "../_hooks/use-pick-slots.js";
import { isLeafNode, isNodeSelectable, isNodeExpandable } from "./utils/index.js";
import { isNodeCheckable, getCheckedStateByCheck } from "./utils/check-utils.js";
import TreeNode from "./node.js";
import { isUndefined, isFunction, isArray } from "../_utils/is.js";
import useMergeState from "../_hooks/use-merge-state.js";
import useCheckedState from "./hooks/use-checked-state.js";
import useTreeData from "./hooks/use-tree-data.js";
import VirtualList from "../_components/virtual-list-v2/virtual-list.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Tree",
  components: {
    VirtualList,
    TreeNode
  },
  props: {
    size: {
      type: String,
      default: "medium"
    },
    blockNode: {
      type: Boolean
    },
    defaultExpandAll: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean
    },
    checkable: {
      type: [Boolean, String, Function],
      default: false
    },
    selectable: {
      type: [Boolean, Function],
      default: true
    },
    checkStrictly: {
      type: Boolean
    },
    checkedStrategy: {
      type: String,
      default: "all"
    },
    defaultSelectedKeys: {
      type: Array
    },
    selectedKeys: {
      type: Array
    },
    defaultCheckedKeys: {
      type: Array
    },
    checkedKeys: {
      type: Array
    },
    defaultExpandedKeys: {
      type: Array
    },
    expandedKeys: {
      type: Array
    },
    data: {
      type: Array,
      default: () => []
    },
    fieldNames: {
      type: Object
    },
    showLine: {
      type: Boolean
    },
    loadMore: {
      type: Function
    },
    draggable: {
      type: Boolean
    },
    allowDrop: {
      type: Function
    },
    filterTreeNode: {
      type: Function
    },
    searchValue: {
      type: String,
      default: ""
    },
    virtualListProps: {
      type: Object
    },
    defaultExpandSelected: {
      type: Boolean
    },
    defaultExpandChecked: {
      type: Boolean
    },
    autoExpandParent: {
      type: Boolean,
      default: true
    },
    halfCheckedKeys: {
      type: Array
    },
    onlyCheckLeaf: {
      type: Boolean,
      default: false
    },
    animation: {
      type: Boolean,
      default: true
    },
    actionOnNodeClick: {
      type: String
    },
    disableSelectActionOnly: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    "select": (selectedKeys, data) => true,
    "update:selectedKeys": (selectedKeys) => true,
    "check": (checkedKeys, data) => true,
    "update:checkedKeys": (checkedKeys) => true,
    "update:halfCheckedKeys": (halfCheckedKeys) => true,
    "expand": (expandKeys, data) => true,
    "update:expandedKeys": (expandKeys) => true,
    "dragStart": (ev, node) => true,
    "dragEnd": (ev, node) => true,
    "dragOver": (ev, node) => true,
    "dragLeave": (ev, node) => true,
    "drop": (data) => true
  },
  setup(props, { emit, slots }) {
    const {
      data: propTreeData,
      showLine,
      multiple,
      loadMore,
      checkStrictly,
      checkedKeys: propCheckedKeys,
      defaultCheckedKeys,
      selectedKeys: propSelectedKeys,
      defaultSelectedKeys,
      expandedKeys: propExpandedKeys,
      defaultExpandedKeys,
      checkedStrategy,
      selectable,
      checkable,
      blockNode,
      fieldNames,
      size,
      defaultExpandAll,
      filterTreeNode,
      draggable,
      allowDrop,
      defaultExpandSelected,
      defaultExpandChecked,
      autoExpandParent,
      halfCheckedKeys,
      onlyCheckLeaf,
      animation
    } = toRefs(props);
    const prefixCls = getPrefixCls("tree");
    const classNames = computed(() => [
      `${prefixCls}`,
      {
        [`${prefixCls}-checkable`]: checkable.value,
        [`${prefixCls}-show-line`]: showLine.value
      },
      `${prefixCls}-size-${size.value}`
    ]);
    const switcherIcon = usePickSlots(slots, "switcher-icon");
    const loadingIcon = usePickSlots(slots, "loading-icon");
    const dragIcon = usePickSlots(slots, "drag-icon");
    const nodeIcon = usePickSlots(slots, "icon");
    const nodeTitle = usePickSlots(slots, "title");
    const nodeExtra = usePickSlots(slots, "extra");
    const { treeData, flattenTreeData, key2TreeNode } = useTreeData(
      reactive({
        treeData: propTreeData,
        selectable,
        showLine,
        blockNode,
        checkable,
        fieldNames,
        loadMore,
        draggable
      })
    );
    const { checkedKeys, indeterminateKeys, setCheckedState } = useCheckedState(
      reactive({
        defaultCheckedKeys,
        checkedKeys: propCheckedKeys,
        checkStrictly,
        key2TreeNode,
        halfCheckedKeys,
        onlyCheckLeaf
      })
    );
    const [selectedKeys, setSelectedState] = useMergeState(
      (defaultSelectedKeys == null ? void 0 : defaultSelectedKeys.value) || [],
      reactive({
        value: propSelectedKeys
      })
    );
    const loadingKeys = ref([]);
    const dragNode = ref();
    function getDefaultExpandedKeys() {
      if (defaultExpandedKeys == null ? void 0 : defaultExpandedKeys.value) {
        const expandedKeysSet = /* @__PURE__ */ new Set([]);
        defaultExpandedKeys.value.forEach((_key) => {
          if (expandedKeysSet.has(_key))
            return;
          const node = key2TreeNode.value.get(_key);
          if (!node)
            return;
          [
            ...autoExpandParent.value ? node.pathParentKeys : [],
            _key
          ].forEach((_key2) => expandedKeysSet.add(_key2));
        });
        return [...expandedKeysSet];
      }
      if (defaultExpandAll.value) {
        return flattenTreeData.value.filter((node) => node.children && node.children.length).map((node) => node.key);
      }
      if (defaultExpandSelected.value || defaultExpandChecked.value) {
        const expandedKeysSet = /* @__PURE__ */ new Set([]);
        const addToExpandKeysSet = (keys) => {
          keys.forEach((key) => {
            const node = key2TreeNode.value.get(key);
            if (!node)
              return;
            (node.pathParentKeys || []).forEach((k) => expandedKeysSet.add(k));
          });
        };
        if (defaultExpandSelected.value) {
          addToExpandKeysSet(selectedKeys.value);
        }
        if (defaultExpandChecked.value) {
          addToExpandKeysSet(checkedKeys.value);
        }
        return [...expandedKeysSet];
      }
      return [];
    }
    const [expandedKeys, setExpandState] = useMergeState(
      getDefaultExpandedKeys(),
      reactive({
        value: propExpandedKeys
      })
    );
    const currentExpandKeys = ref([]);
    const visibleTreeNodeList = computed(() => {
      const expandedKeysSet = new Set(expandedKeys.value);
      const currentExpandKeysSet = new Set(currentExpandKeys.value);
      return flattenTreeData.value.filter((node) => {
        var _a;
        const passFilter = !filterTreeNode || !filterTreeNode.value || (filterTreeNode == null ? void 0 : filterTreeNode.value(node.treeNodeData));
        if (!passFilter)
          return false;
        const isRoot = isUndefined(node.parentKey);
        const isVisibleNode = (_a = node.pathParentKeys) == null ? void 0 : _a.every(
          (_key) => expandedKeysSet.has(_key) && !currentExpandKeysSet.has(_key)
        );
        return isRoot || isVisibleNode;
      });
    });
    function getPublicCheckedKeys(rawCheckedKeys, rawCheckedStrategy = checkedStrategy.value) {
      let publicCheckedKeys = [...rawCheckedKeys];
      if (rawCheckedStrategy === "parent") {
        publicCheckedKeys = rawCheckedKeys.filter((_key) => {
          const item = key2TreeNode.value.get(_key);
          return item && !(!isUndefined(item.parentKey) && rawCheckedKeys.includes(item.parentKey));
        });
      } else if (rawCheckedStrategy === "child") {
        publicCheckedKeys = rawCheckedKeys.filter((_key) => {
          var _a, _b;
          return !((_b = (_a = key2TreeNode.value.get(_key)) == null ? void 0 : _a.children) == null ? void 0 : _b.length);
        });
      }
      return publicCheckedKeys;
    }
    function getNodes(keys) {
      return keys.map((key) => {
        var _a;
        return ((_a = key2TreeNode.value.get(key)) == null ? void 0 : _a.treeNodeData) || void 0;
      }).filter(Boolean);
    }
    function emitCheckEvent(options) {
      const {
        targetKey,
        targetChecked,
        newCheckedKeys,
        newIndeterminateKeys,
        event
      } = options;
      const targetNode = targetKey ? key2TreeNode.value.get(targetKey) : void 0;
      const publicCheckedKeys = getPublicCheckedKeys(newCheckedKeys);
      emit("update:checkedKeys", publicCheckedKeys);
      emit("update:halfCheckedKeys", newIndeterminateKeys);
      emit("check", publicCheckedKeys, {
        checked: targetChecked,
        node: targetNode == null ? void 0 : targetNode.treeNodeData,
        checkedNodes: getNodes(publicCheckedKeys),
        halfCheckedKeys: newIndeterminateKeys,
        halfCheckedNodes: getNodes(newIndeterminateKeys),
        e: event
      });
    }
    function emitSelectEvent(options) {
      const { targetKey, targetSelected, newSelectedKeys, event } = options;
      const targetNode = targetKey ? key2TreeNode.value.get(targetKey) : void 0;
      emit("update:selectedKeys", newSelectedKeys);
      emit("select", newSelectedKeys, {
        selected: targetSelected,
        node: targetNode == null ? void 0 : targetNode.treeNodeData,
        selectedNodes: getNodes(newSelectedKeys),
        e: event
      });
    }
    function emitExpandEvent(options) {
      const { targetKey, targetExpanded, newExpandedKeys, event } = options;
      const targetNode = targetKey ? key2TreeNode.value.get(targetKey) : void 0;
      emit("expand", newExpandedKeys, {
        expanded: targetExpanded,
        node: targetNode == null ? void 0 : targetNode.treeNodeData,
        expandedNodes: getNodes(newExpandedKeys),
        e: event
      });
      emit("update:expandedKeys", newExpandedKeys);
    }
    function setCheckedKeys(keys) {
      const [newCheckedKeys, newIndeterminateKeys] = setCheckedState(
        keys,
        [],
        true
      );
      emitCheckEvent({ newCheckedKeys, newIndeterminateKeys });
    }
    function setSelectedKeys(keys) {
      let newSelectedKeys = keys;
      if (!multiple.value && keys.length > 1) {
        newSelectedKeys = [keys[0]];
      }
      setSelectedState(newSelectedKeys);
      emitSelectEvent({
        newSelectedKeys
      });
    }
    function setExpandedKeys(keys) {
      currentExpandKeys.value = [];
      setExpandState(keys);
      emitExpandEvent({ newExpandedKeys: keys });
    }
    function checkNodes(keys, checked, targetKey) {
      if (!keys.length)
        return;
      let newCheckedKeys = [...checkedKeys.value];
      let newIndeterminateKeys = [...indeterminateKeys.value];
      keys.forEach((key) => {
        const node = key2TreeNode.value.get(key);
        if (node) {
          [newCheckedKeys, newIndeterminateKeys] = getCheckedStateByCheck({
            node,
            checked,
            checkedKeys: [...newCheckedKeys],
            indeterminateKeys: [...newIndeterminateKeys],
            checkStrictly: checkStrictly.value
          });
        }
      });
      setCheckedState(newCheckedKeys, newIndeterminateKeys);
      emitCheckEvent({
        targetKey,
        targetChecked: isUndefined(targetKey) ? void 0 : checked,
        newCheckedKeys,
        newIndeterminateKeys
      });
    }
    function selectNodes(keys, selected, targetKey) {
      if (!keys.length)
        return;
      let newSelectedKeys;
      if (multiple.value) {
        const selectedKeysSet = new Set(selectedKeys.value);
        keys.forEach((key) => {
          selected ? selectedKeysSet.add(key) : selectedKeysSet.delete(key);
        });
        newSelectedKeys = [...selectedKeysSet];
      } else {
        newSelectedKeys = selected ? [keys[0]] : [];
      }
      setSelectedState(newSelectedKeys);
      emitSelectEvent({
        targetKey,
        targetSelected: isUndefined(targetKey) ? void 0 : selected,
        newSelectedKeys
      });
    }
    function expandNodes(keys, expanded, targetKey) {
      const expandedKeysSet = new Set(expandedKeys.value);
      keys.forEach((key) => {
        expanded ? expandedKeysSet.add(key) : expandedKeysSet.delete(key);
        onExpandEnd(key);
      });
      const newExpandedKeys = [...expandedKeysSet];
      setExpandState(newExpandedKeys);
      emitExpandEvent({
        targetKey,
        targetExpanded: isUndefined(targetKey) ? void 0 : expanded,
        newExpandedKeys
      });
    }
    function onCheck(checked, key, e) {
      const node = key2TreeNode.value.get(key);
      if (!node)
        return;
      const [newCheckedKeys, newIndeterminateKeys] = getCheckedStateByCheck({
        node,
        checked,
        checkedKeys: checkedKeys.value,
        indeterminateKeys: indeterminateKeys.value,
        checkStrictly: checkStrictly.value
      });
      setCheckedState(newCheckedKeys, newIndeterminateKeys);
      emitCheckEvent({
        targetKey: key,
        targetChecked: checked,
        newCheckedKeys,
        newIndeterminateKeys,
        event: e
      });
    }
    function onSelect(key, e) {
      const node = key2TreeNode.value.get(key);
      if (!node)
        return;
      let newSelectedKeys;
      let selected;
      if (multiple.value) {
        const selectedKeysSet = new Set(selectedKeys.value);
        selected = !selectedKeysSet.has(key);
        selected ? selectedKeysSet.add(key) : selectedKeysSet.delete(key);
        newSelectedKeys = [...selectedKeysSet];
      } else {
        selected = true;
        newSelectedKeys = [key];
      }
      setSelectedState(newSelectedKeys);
      emitSelectEvent({
        targetKey: key,
        targetSelected: selected,
        newSelectedKeys,
        event: e
      });
    }
    function onExpand(expanded, key, e) {
      if (currentExpandKeys.value.includes(key))
        return;
      const node = key2TreeNode.value.get(key);
      if (!node)
        return;
      const expandedKeysSet = new Set(expandedKeys.value);
      expanded ? expandedKeysSet.add(key) : expandedKeysSet.delete(key);
      const newExpandedKeys = [...expandedKeysSet];
      setExpandState(newExpandedKeys);
      if (animation.value) {
        currentExpandKeys.value.push(key);
      }
      emitExpandEvent({
        targetKey: key,
        targetExpanded: expanded,
        newExpandedKeys,
        event: e
      });
    }
    function onExpandEnd(key) {
      const index = currentExpandKeys.value.indexOf(key);
      currentExpandKeys.value.splice(index, 1);
    }
    const onLoadMore = computed(
      () => (loadMore == null ? void 0 : loadMore.value) ? async (key) => {
        if (!isFunction(loadMore.value))
          return;
        const node = key2TreeNode.value.get(key);
        if (!node)
          return;
        const { treeNodeData } = node;
        loadingKeys.value = [.../* @__PURE__ */ new Set([...loadingKeys.value, key])];
        try {
          await loadMore.value(treeNodeData);
          loadingKeys.value = loadingKeys.value.filter((v) => v !== key);
          onExpand(true, key);
          if (checkedKeys.value.includes(key)) {
            onCheck(true, key);
          }
        } catch (err) {
          loadingKeys.value = loadingKeys.value.filter((v) => v !== key);
          console.error("[tree]load data error: ", err);
        }
      } : void 0
    );
    const treeContext = reactive({
      treeProps: props,
      switcherIcon,
      loadingIcon,
      dragIcon,
      nodeIcon,
      nodeTitle,
      nodeExtra,
      treeData,
      flattenTreeData,
      key2TreeNode,
      checkedKeys,
      indeterminateKeys,
      selectedKeys,
      expandedKeys,
      loadingKeys,
      currentExpandKeys,
      onLoadMore,
      filterTreeNode,
      onCheck,
      onSelect,
      onExpand,
      onExpandEnd,
      allowDrop(key, dropPosition) {
        const node = key2TreeNode.value.get(key);
        if (node && isFunction(allowDrop.value)) {
          return !!allowDrop.value({
            dropNode: node.treeNodeData,
            dropPosition
          });
        }
        return true;
      },
      onDragStart(key, e) {
        const node = key2TreeNode.value.get(key);
        dragNode.value = node;
        if (node) {
          emit("dragStart", e, node.treeNodeData);
        }
      },
      onDragEnd(key, e) {
        const node = key2TreeNode.value.get(key);
        dragNode.value = void 0;
        if (node) {
          emit("dragEnd", e, node.treeNodeData);
        }
      },
      onDragOver(key, e) {
        const node = key2TreeNode.value.get(key);
        if (node) {
          emit("dragOver", e, node.treeNodeData);
        }
      },
      onDragLeave(key, e) {
        const node = key2TreeNode.value.get(key);
        if (node) {
          emit("dragLeave", e, node.treeNodeData);
        }
      },
      onDrop(key, dropPosition, e) {
        const node = key2TreeNode.value.get(key);
        if (dragNode.value && node && !(node.key === dragNode.value.key || node.pathParentKeys.includes(dragNode.value.key || ""))) {
          emit("drop", {
            e,
            dragNode: dragNode.value.treeNodeData,
            dropNode: node.treeNodeData,
            dropPosition
          });
        }
      }
    });
    provide(TreeInjectionKey, treeContext);
    return {
      classNames,
      visibleTreeNodeList,
      treeContext,
      virtualListRef: ref(),
      computedSelectedKeys: selectedKeys,
      computedExpandedKeys: expandedKeys,
      computedCheckedKeys: checkedKeys,
      computedIndeterminateKeys: indeterminateKeys,
      getPublicCheckedKeys,
      getNodes,
      internalCheckNodes: checkNodes,
      internalSetCheckedKeys: setCheckedKeys,
      internalSelectNodes: selectNodes,
      internalSetSelectedKeys: setSelectedKeys,
      internalExpandNodes: expandNodes,
      internalSetExpandedKeys: setExpandedKeys
    };
  },
  methods: {
    toggleCheck(key, e) {
      const { key2TreeNode, onCheck, checkedKeys } = this.treeContext;
      const checked = !checkedKeys.includes(key);
      const node = key2TreeNode.get(key);
      if (node && isNodeCheckable(node)) {
        onCheck(checked, key, e);
      }
    },
    scrollIntoView(options) {
      this.virtualListRef && this.virtualListRef.scrollTo(options);
    },
    getSelectedNodes() {
      return this.getNodes(this.computedSelectedKeys);
    },
    getCheckedNodes(options = {}) {
      const { checkedStrategy, includeHalfChecked } = options;
      const checkedKeys = this.getPublicCheckedKeys(
        this.computedCheckedKeys,
        checkedStrategy
      );
      const checkedNodes = this.getNodes(checkedKeys);
      return [
        ...checkedNodes,
        ...includeHalfChecked ? this.getHalfCheckedNodes() : []
      ];
    },
    getHalfCheckedNodes() {
      return this.getNodes(this.computedIndeterminateKeys);
    },
    getExpandedNodes() {
      return this.getNodes(this.computedExpandedKeys);
    },
    checkAll(checked = true) {
      const { key2TreeNode } = this.treeContext;
      const newKeys = checked ? [...key2TreeNode.keys()].filter((key) => {
        const node = key2TreeNode.get(key);
        return node && isNodeCheckable(node);
      }) : [];
      this.internalSetCheckedKeys(newKeys);
    },
    checkNode(key, checked = true, onlyCheckLeaf = false) {
      const { checkStrictly, treeContext } = this;
      const { key2TreeNode } = treeContext;
      const isBatch = isArray(key);
      const keys = (isBatch ? key : [key]).filter((key2) => {
        const node = key2TreeNode.get(key2);
        return node && isNodeCheckable(node) && (checkStrictly || !onlyCheckLeaf || isLeafNode(node));
      });
      this.internalCheckNodes(keys, checked, isBatch ? void 0 : key);
    },
    selectAll(selected = true) {
      const { key2TreeNode } = this.treeContext;
      const newKeys = selected ? [...key2TreeNode.keys()].filter((key) => {
        const node = key2TreeNode.get(key);
        return node && isNodeSelectable(node);
      }) : [];
      this.internalSetSelectedKeys(newKeys);
    },
    selectNode(key, selected = true) {
      const { key2TreeNode } = this.treeContext;
      const isBatch = isArray(key);
      const keys = (isBatch ? key : [key]).filter((key2) => {
        const node = key2TreeNode.get(key2);
        return node && isNodeSelectable(node);
      });
      this.internalSelectNodes(keys, selected, isBatch ? void 0 : key);
    },
    expandAll(expanded = true) {
      const { key2TreeNode } = this.treeContext;
      const newKeys = expanded ? [...key2TreeNode.keys()].filter((key) => {
        const node = key2TreeNode.get(key);
        return node && isNodeExpandable(node);
      }) : [];
      this.internalSetExpandedKeys(newKeys);
    },
    expandNode(key, expanded = true) {
      const { key2TreeNode } = this.treeContext;
      const isBatch = isArray(key);
      const keys = (isBatch ? key : [key]).filter((key2) => {
        const node = key2TreeNode.get(key2);
        return node && isNodeExpandable(node);
      });
      this.internalExpandNodes(keys, expanded, isBatch ? void 0 : key);
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_TreeNode = resolveComponent("TreeNode");
  const _component_VirtualList = resolveComponent("VirtualList");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.classNames)
  }, [
    _ctx.virtualListProps ? (openBlock(), createBlock(_component_VirtualList, mergeProps({
      key: 0,
      ref: "virtualListRef"
    }, _ctx.virtualListProps, { data: _ctx.visibleTreeNodeList }), {
      item: withCtx(({ item: node }) => [
        (openBlock(), createBlock(_component_TreeNode, mergeProps({
          key: `${_ctx.searchValue}-${node.key}`
        }, node.treeNodeProps), null, 16))
      ]),
      _: 1
    }, 16, ["data"])) : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(_ctx.visibleTreeNodeList, (node) => {
      return openBlock(), createBlock(_component_TreeNode, mergeProps({
        key: node.key,
        ref_for: true
      }, node.treeNodeProps), null, 16);
    }), 128))
  ], 2);
}
var _Tree = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Tree as default };
