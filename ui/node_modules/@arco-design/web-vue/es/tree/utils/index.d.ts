import { Key2TreeNode, Node } from '../interface';
export declare function getFlattenTreeData(tree: Node[]): Node[];
export declare function getKey2TreeNode(flattenTreeData: Node[]): Key2TreeNode;
export declare function isNodeSelectable(node: Node): boolean;
export declare function isNodeExpandable(node: Node): false | Node[] | undefined;
export declare function isLeafNode(node: Node): boolean;
