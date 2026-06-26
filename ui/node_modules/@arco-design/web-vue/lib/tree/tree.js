"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var context = require("./context.js");
var usePickSlots = require("../_hooks/use-pick-slots.js");
var index = require("./utils/index.js");
var checkUtils = require("./utils/check-utils.js");
var node = require("./node.js");
var is = require("../_utils/is.js");
var useMergeState = require("../_hooks/use-merge-state.js");
var useCheckedState = require("./hooks/use-checked-state.js");
var useTreeData = require("./hooks/use-tree-data.js");
var virtualList = require("../_components/virtual-list-v2/virtual-list.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Tree",
  components: {
    VirtualList: virtualList,
    TreeNode: node
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
    "dragStart": (ev, node2) => true,
    "dragEnd": (ev, node2) => true,
    "dragOver": (ev, node2) => true,
    "dragLeave": (ev, node2) => true,
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
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("tree");
    const classNames = vue.computed(() => [
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
      vue.reactive({
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
      vue.reactive({
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
      vue.reactive({
        value: propSelectedKeys
      })
    );
    const loadingKeys = vue.ref([]);
    const dragNode = vue.ref();
    function getDefaultExpandedKeys() {
      if (defaultExpandedKeys == null ? void 0 : defaultExpandedKeys.value) {
        const expandedKeysSet = /* @__PURE__ */ new Set([]);
        defaultExpandedKeys.value.forEach((_key) => {
          if (expandedKeysSet.has(_key))
            return;
          const node2 = key2TreeNode.value.get(_key);
          if (!node2)
            return;
          [
            ...autoExpandParent.value ? node2.pathParentKeys : [],
            _key
          ].forEach((_key2) => expandedKeysSet.add(_key2));
        });
        return [...expandedKeysSet];
      }
      if (defaultExpandAll.value) {
        return flattenTreeData.value.filter((node2) => node2.children && node2.children.length).map((node2) => node2.key);
      }
      if (defaultExpandSelected.value || defaultExpandChecked.value) {
        const expandedKeysSet = /* @__PURE__ */ new Set([]);
        const addToExpandKeysSet = (keys) => {
          keys.forEach((key) => {
            const node2 = key2TreeNode.value.get(key);
            if (!node2)
              return;
            (node2.pathParentKeys || []).forEach((k) => expandedKeysSet.add(k));
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
      vue.reactive({
        value: propExpandedKeys
      })
    );
    const currentExpandKeys = vue.ref([]);
    const visibleTreeNodeList = vue.computed(() => {
      const expandedKeysSet = new Set(expandedKeys.value);
      const currentExpandKeysSet = new Set(currentExpandKeys.value);
      return flattenTreeData.value.filter((node2) => {
        var _a;
        const passFilter = !filterTreeNode || !filterTreeNode.value || (filterTreeNode == null ? void 0 : filterTreeNode.value(node2.treeNodeData));
        if (!passFilter)
          return false;
        const isRoot = is.isUndefined(node2.parentKey);
        const isVisibleNode = (_a = node2.pathParentKeys) == null ? void 0 : _a.every(
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
          return item && !(!is.isUndefined(item.parentKey) && rawCheckedKeys.includes(item.parentKey));
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
        const node2 = key2TreeNode.value.get(key);
        if (node2) {
          [newCheckedKeys, newIndeterminateKeys] = checkUtils.getCheckedStateByCheck({
            node: node2,
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
        targetChecked: is.isUndefined(targetKey) ? void 0 : checked,
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
        targetSelected: is.isUndefined(targetKey) ? void 0 : selected,
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
        targetExpanded: is.isUndefined(targetKey) ? void 0 : expanded,
        newExpandedKeys
      });
    }
    function onCheck(checked, key, e) {
      const node2 = key2TreeNode.value.get(key);
      if (!node2)
        return;
      const [newCheckedKeys, newIndeterminateKeys] = checkUtils.getCheckedStateByCheck({
        node: node2,
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
      const node2 = key2TreeNode.value.get(key);
      if (!node2)
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
      const node2 = key2TreeNode.value.get(key);
      if (!node2)
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
      const index2 = currentExpandKeys.value.indexOf(key);
      currentExpandKeys.value.splice(index2, 1);
    }
    const onLoadMore = vue.computed(
      () => (loadMore == null ? void 0 : loadMore.value) ? async (key) => {
        if (!is.isFunction(loadMore.value))
          return;
        const node2 = key2TreeNode.value.get(key);
        if (!node2)
          return;
        const { treeNodeData } = node2;
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
    const treeContext = vue.reactive({
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
        const node2 = key2TreeNode.value.get(key);
        if (node2 && is.isFunction(allowDrop.value)) {
          return !!allowDrop.value({
            dropNode: node2.treeNodeData,
            dropPosition
          });
        }
        return true;
      },
      onDragStart(key, e) {
        const node2 = key2TreeNode.value.get(key);
        dragNode.value = node2;
        if (node2) {
          emit("dragStart", e, node2.treeNodeData);
        }
      },
      onDragEnd(key, e) {
        const node2 = key2TreeNode.value.get(key);
        dragNode.value = void 0;
        if (node2) {
          emit("dragEnd", e, node2.treeNodeData);
        }
      },
      onDragOver(key, e) {
        const node2 = key2TreeNode.value.get(key);
        if (node2) {
          emit("dragOver", e, node2.treeNodeData);
        }
      },
      onDragLeave(key, e) {
        const node2 = key2TreeNode.value.get(key);
        if (node2) {
          emit("dragLeave", e, node2.treeNodeData);
        }
      },
      onDrop(key, dropPosition, e) {
        const node2 = key2TreeNode.value.get(key);
        if (dragNode.value && node2 && !(node2.key === dragNode.value.key || node2.pathParentKeys.includes(dragNode.value.key || ""))) {
          emit("drop", {
            e,
            dragNode: dragNode.value.treeNodeData,
            dropNode: node2.treeNodeData,
            dropPosition
          });
        }
      }
    });
    vue.provide(context.TreeInjectionKey, treeContext);
    return {
      classNames,
      visibleTreeNodeList,
      treeContext,
      virtualListRef: vue.ref(),
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
      const node2 = key2TreeNode.get(key);
      if (node2 && checkUtils.isNodeCheckable(node2)) {
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
        const node2 = key2TreeNode.get(key);
        return node2 && checkUtils.isNodeCheckable(node2);
      }) : [];
      this.internalSetCheckedKeys(newKeys);
    },
    checkNode(key, checked = true, onlyCheckLeaf = false) {
      const { checkStrictly, treeContext } = this;
      const { key2TreeNode } = treeContext;
      const isBatch = is.isArray(key);
      const keys = (isBatch ? key : [key]).filter((key2) => {
        const node2 = key2TreeNode.get(key2);
        return node2 && checkUtils.isNodeCheckable(node2) && (checkStrictly || !onlyCheckLeaf || index.isLeafNode(node2));
      });
      this.internalCheckNodes(keys, checked, isBatch ? void 0 : key);
    },
    selectAll(selected = true) {
      const { key2TreeNode } = this.treeContext;
      const newKeys = selected ? [...key2TreeNode.keys()].filter((key) => {
        const node2 = key2TreeNode.get(key);
        return node2 && index.isNodeSelectable(node2);
      }) : [];
      this.internalSetSelectedKeys(newKeys);
    },
    selectNode(key, selected = true) {
      const { key2TreeNode } = this.treeContext;
      const isBatch = is.isArray(key);
      const keys = (isBatch ? key : [key]).filter((key2) => {
        const node2 = key2TreeNode.get(key2);
        return node2 && index.isNodeSelectable(node2);
      });
      this.internalSelectNodes(keys, selected, isBatch ? void 0 : key);
    },
    expandAll(expanded = true) {
      const { key2TreeNode } = this.treeContext;
      const newKeys = expanded ? [...key2TreeNode.keys()].filter((key) => {
        const node2 = key2TreeNode.get(key);
        return node2 && index.isNodeExpandable(node2);
      }) : [];
      this.internalSetExpandedKeys(newKeys);
    },
    expandNode(key, expanded = true) {
      const { key2TreeNode } = this.treeContext;
      const isBatch = is.isArray(key);
      const keys = (isBatch ? key : [key]).filter((key2) => {
        const node2 = key2TreeNode.get(key2);
        return node2 && index.isNodeExpandable(node2);
      });
      this.internalExpandNodes(keys, expanded, isBatch ? void 0 : key);
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_TreeNode = vue.resolveComponent("TreeNode");
  const _component_VirtualList = vue.resolveComponent("VirtualList");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.classNames)
  }, [
    _ctx.virtualListProps ? (vue.openBlock(), vue.createBlock(_component_VirtualList, vue.mergeProps({
      key: 0,
      ref: "virtualListRef"
    }, _ctx.virtualListProps, { data: _ctx.visibleTreeNodeList }), {
      item: vue.withCtx(({ item: node2 }) => [
        (vue.openBlock(), vue.createBlock(_component_TreeNode, vue.mergeProps({
          key: `${_ctx.searchValue}-${node2.key}`
        }, node2.treeNodeProps), null, 16))
      ]),
      _: 1
    }, 16, ["data"])) : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(_ctx.visibleTreeNodeList, (node2) => {
      return vue.openBlock(), vue.createBlock(_component_TreeNode, vue.mergeProps({
        key: node2.key,
        ref_for: true
      }, node2.treeNodeProps), null, 16);
    }), 128))
  ], 2);
}
var _Tree = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Tree;
