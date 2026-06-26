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
    height?: number | string;
    threshold?: number;
    isStaticItemHeight?: boolean;
    fixedSize?: boolean;
    estimatedSize?: number;
    buffer?: number;
    data?: unknown[];
    itemKey?: string | ((item: unknown) => VirtualItemKey);
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
