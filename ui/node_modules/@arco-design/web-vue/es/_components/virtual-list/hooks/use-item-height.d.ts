import { InternalDataItem, VirtualItemKey } from '../interface';
export declare function useItemHeight(props: {
    estimatedItemHeight?: number;
    data: InternalDataItem[];
}): {
    itemHeight: import("vue").ComputedRef<number>;
    minItemHeight: import("vue").ComputedRef<number>;
    estimatedItemHeight: import("vue").Ref<number | undefined, number | undefined>;
    totalHeight: import("vue").ComputedRef<number>;
    setItemHeight: (key: VirtualItemKey, height: number) => void;
    getItemHeight: (key: VirtualItemKey) => number | undefined;
    getItemHeightOrDefault: (key: VirtualItemKey) => number;
    getItemHeightByIndex: (index: number) => number | undefined;
    getItemHeightOrDefaultByIndex: (index: number) => number;
};
