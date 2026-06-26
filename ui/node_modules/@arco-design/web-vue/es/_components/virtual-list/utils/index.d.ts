import { VirtualItemKey } from '../interface';
export declare function getValidScrollTop(scrollTop: number, scrollRange: number): number;
export declare function getScrollPercentage({ scrollTop, scrollHeight, clientHeight, }: {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
}): number;
export declare function getLocationItem(scrollPtg: number, itemCount: number): {
    index: number;
    offsetPtg: number;
};
export declare function getRangeIndex(scrollPtg: number, itemCount: number, visibleCount: number): {
    itemIndex: number;
    itemOffsetPtg: number;
    startIndex: number;
    endIndex: number;
};
interface ItemTopConfig {
    itemHeight: number;
    itemOffsetPtg: number;
    scrollTop: number;
    scrollPtg: number;
    clientHeight: number;
}
export declare function getItemRelativeTop({ itemHeight, itemOffsetPtg, scrollPtg, clientHeight, }: Omit<ItemTopConfig, 'scrollTop'>): number;
export declare function getItemAbsoluteTop({ scrollTop, ...rest }: ItemTopConfig): number;
interface CompareItemConfig {
    locatedItemRelativeTop: number;
    locatedItemIndex: number;
    compareItemIndex: number;
    getItemKeyByIndex: (index: number) => VirtualItemKey;
    startIndex: number;
    endIndex: number;
    getItemHeightOrDefault: (key: VirtualItemKey) => number;
}
export declare function getCompareItemRelativeTop({ locatedItemRelativeTop, locatedItemIndex, compareItemIndex, startIndex, endIndex, getItemKeyByIndex, getItemHeightOrDefault, }: CompareItemConfig): number;
export {};
