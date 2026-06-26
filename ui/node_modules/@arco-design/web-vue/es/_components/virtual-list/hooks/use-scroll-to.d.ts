import { InternalDataItem, VirtualItemKey, ScrollOptions } from '../interface';
export interface RelativeScroll {
    itemIndex: number;
    relativeTop: number;
}
export declare function useScrollTo(props: {
    isVirtual: boolean;
    isStaticItemHeight: boolean;
    data: InternalDataItem[];
    viewportRef: HTMLElement | undefined;
    rangeState: {
        itemIndex: number;
        itemOffsetPtg: number;
        startIndex: number;
        endIndex: number;
    };
    scrollTop: number;
    visibleCount: number;
    getItemHeightOrDefault: (key: VirtualItemKey) => number;
    getItemHeightOrDefaultByIndex: (index: number) => number;
}): {
    fixScrollTo: (relativeScroll: RelativeScroll) => {
        scrollTop: number;
        itemIndex: number;
        itemOffsetPtg: number;
        startIndex: number;
        endIndex: number;
    } | null;
    prepareScrollTo: (options: ScrollOptions) => {
        itemIndex: number;
        relativeTop: number;
        startIndex: number;
        endIndex: number;
    } | null;
};
