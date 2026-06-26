import { VNode } from 'vue';
import { ItemSlot, InternalDataItem, VirtualItemKey } from '../interface';
export declare function useRenderChildren(props: {
    internalData: InternalDataItem[];
    visibleData: InternalDataItem[];
    itemRender: ItemSlot;
}, events?: {
    onItemResize?: (height: HTMLElement, key: VirtualItemKey) => void;
}): () => (VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}> | undefined)[];
