import { TreeNodeKey, Key2TreeNode } from '../interface';
export default function useCheckedState(props: {
    defaultCheckedKeys: TreeNodeKey[] | undefined;
    checkedKeys: TreeNodeKey[] | undefined;
    halfCheckedKeys: TreeNodeKey[] | undefined;
    key2TreeNode: Key2TreeNode;
    checkStrictly: boolean;
    onlyCheckLeaf: boolean;
}): {
    checkedKeys: import("vue").ComputedRef<TreeNodeKey[]>;
    indeterminateKeys: import("vue").ComputedRef<TreeNodeKey[]>;
    setCheckedState(newCheckedKeys: TreeNodeKey[], newIndeterminateKeys: TreeNodeKey[], reinitialize?: boolean): TreeNodeKey[][];
};
