import { VNode } from 'vue';
export declare type VirtualItemKey = string | number;
export interface InternalDataItem {
    key: VirtualItemKey;
    index: number;
    item: unknown;
}
export declare type ItemSlot = (props: {
    item: unknown;
    index: number;
}) => VNode[];
export interface ScrollIntoViewOptions {
    index?: number;
    key?: VirtualItemKey;
    align: 'auto' | 'top' | 'bottom';
}
export interface VirtualListProps {
    height: number | string;
    threshold?: number | null;
    isStaticItemHeight?: boolean;
    estimatedItemHeight?: number;
    data?: unknown[];
    itemKey?: string;
    component?: keyof HTMLElementTagNameMap;
}
export declare type ScrollOptions = number | {
    index?: number;
    key?: VirtualItemKey;
    align?: 'auto' | 'top' | 'bottom';
};
export interface VirtualListRef {
    scrollTo: (options: ScrollOptions) => void;
}
