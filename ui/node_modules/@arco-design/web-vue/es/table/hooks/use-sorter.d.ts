import type { Ref } from 'vue';
import type { Sorter, TableColumnData } from '../interface';
export declare const useSorter: ({ columns, onSorterChange, }: {
    columns: Ref<TableColumnData[]>;
    onSorterChange: (dataIndex: string, direction: 'ascend' | 'descend' | '') => void;
}) => {
    _sorter: Ref<{
        field: string;
        direction: "ascend" | "descend";
    } | undefined, Sorter | {
        field: string;
        direction: "ascend" | "descend";
    } | undefined>;
    computedSorter: import("vue").ComputedRef<Sorter | undefined>;
    resetSorters: () => void;
    clearSorters: () => void;
};
