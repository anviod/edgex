import { Slot, VNode } from 'vue';
import { VirtualListProps } from '../_components/virtual-list-v2/interface';
import { Size } from '../_utils/constant';
export declare type TreeNodeKey = number | string;
export interface TreeNodeData {
    key?: string | number;
    title?: string;
    selectable?: boolean;
    disabled?: boolean;
    disableCheckbox?: boolean;
    checkable?: boolean;
    draggable?: boolean;
    isLeaf?: boolean;
    icon?: () => VNode;
    switcherIcon?: () => VNode;
    loadingIcon?: () => VNode;
    dragIcon?: () => VNode;
    children?: TreeNodeData[];
}
export interface TreeNodeProps extends Omit<TreeNodeData, 'children'> {
    selectable: boolean;
    disabled: boolean;
    disableCheckbox: boolean;
    checkable: boolean;
    draggable: boolean;
    isLeaf: boolean;
    isTail: boolean;
    blockNode: boolean;
    showLine: boolean;
    level: number;
    lineless: boolean[];
}
export interface Node extends TreeNodeProps {
    key: TreeNodeKey;
    treeNodeProps: TreeNodeProps;
    treeNodeData: TreeNodeData;
    parent?: Node;
    parentKey?: TreeNodeKey;
    pathParentKeys: TreeNodeKey[];
    children?: Node[];
}
export declare type FilterTreeNode = (node: TreeNodeData) => boolean;
export interface TreeFieldNames {
    key?: string;
    title?: string;
    disabled?: string;
    children?: string;
    isLeaf?: string;
    disableCheckbox?: string;
    checkable?: string;
    icon?: string;
}
export declare type LoadMore = (node: TreeNodeData) => Promise<void>;
export declare type DropPosition = -1 | 0 | 1;
export declare type CheckedStrategy = 'all' | 'parent' | 'child';
export declare type CheckableType = boolean | ((node: TreeNodeData, info: {
    level: number;
    isLeaf: boolean;
}) => boolean);
export declare type SelectableType = CheckableType;
export interface TreeProps {
    size: Size;
    blockNode: boolean;
    defaultExpandAll: boolean;
    multiple: boolean;
    checkable: CheckableType;
    draggable: boolean;
    allowDrop?: (options: {
        dropNode: TreeNodeData;
        dropPosition: DropPosition;
    }) => boolean;
    selectable: SelectableType;
    checkStrictly: boolean;
    checkedStrategy: CheckedStrategy;
    defaultSelectedKeys?: TreeNodeKey[];
    selectedKeys?: TreeNodeKey[];
    defaultCheckedKeys?: TreeNodeKey[];
    checkedKeys?: TreeNodeKey[];
    halfCheckedKeys: TreeNodeKey[] | undefined;
    defaultExpandedKeys?: TreeNodeKey[];
    expandedKeys?: TreeNodeKey[];
    data: TreeNodeData[];
    fieldNames?: TreeFieldNames;
    virtualListProps?: VirtualListProps;
    showLine: boolean;
    loadMore?: LoadMore;
    defaultExpandSelected?: boolean;
    defaultExpandChecked?: boolean;
    autoExpandParent?: boolean;
    onlyCheckLeaf: boolean;
    animation: boolean;
    actionOnNodeClick?: 'expand';
    disableSelectActionOnly: boolean;
    dragIcon?: Slot;
    switcherIcon?: Slot;
    loadingIcon?: Slot;
    extra?: Slot;
    title?: Slot;
    onSelect?: (selectedKeys: TreeNodeKey[], event: {
        selected?: boolean;
        selectedNodes: TreeNodeData[];
        node?: TreeNodeData;
        e?: Event;
    }) => void;
    onCheck?: (checkedKeys: TreeNodeKey[], event: {
        checked?: boolean;
        checkedNodes: TreeNodeData[];
        node?: TreeNodeData;
        halfCheckedKeys: TreeNodeKey[];
        halfCheckedNodes: TreeNodeData[];
        e?: Event;
    }) => void;
    onExpand?: (expandedKeys: TreeNodeKey[], event: {
        expanded: boolean;
        expandedNodes: TreeNodeData[];
        node: TreeNodeData;
        e?: Event;
    }) => void;
    onDragStart?: (e: DragEvent, node: TreeNodeData) => void;
    onDragEnd?: (e: DragEvent, node: TreeNodeData) => void;
    onDragOver?: (e: DragEvent, node: TreeNodeData) => void;
    onDragLeave?: (e: DragEvent, node: TreeNodeData) => void;
    onDrop?: (event: {
        e: DragEvent;
        dragNode: TreeNodeData;
        dropNode: TreeNodeData;
        dropPosition: DropPosition;
    }) => void;
    filterTreeNode?: (node: TreeNodeData) => boolean;
}
export declare type Key2TreeNode = Map<TreeNodeKey, Node>;
