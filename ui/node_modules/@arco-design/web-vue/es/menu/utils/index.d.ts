import { VNode } from 'vue';
export declare function isFragmentChildren(children: VNode[]): boolean;
export declare function isVNodeComponent(vNode: VNode): boolean;
export declare function isArrayChildren(vNode: VNode): boolean;
export declare function isSlotChildren(vNode: VNode): number | false;
export declare function isChildrenSelected(children: VNode[] | undefined, keys: string[]): boolean;
