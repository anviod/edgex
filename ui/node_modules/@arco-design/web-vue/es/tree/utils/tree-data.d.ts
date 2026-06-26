import { TreeNodeData, Node, TreeFieldNames, SelectableType, CheckableType } from '../interface';
interface TreeProps {
    fieldNames?: TreeFieldNames;
    selectable: SelectableType;
    checkable: CheckableType;
    blockNode: boolean;
    showLine: boolean;
    loadMore: boolean;
    draggable: boolean;
}
export declare const generateKey: () => string;
export declare function generateTreeData(treeData: TreeNodeData[], treeProps: TreeProps): Node[];
export {};
