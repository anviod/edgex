import type { Ref } from 'vue';
import type { TableColumnData } from '../interface';
import type { TableContext } from '../context';
export declare const useColumnFilter: ({ column, tableCtx, }: {
    column: Ref<TableColumnData>;
    tableCtx: Partial<TableContext>;
}) => {
    filterPopupVisible: Ref<boolean, boolean>;
    isFilterActive: import("vue").ComputedRef<boolean>;
    isMultipleFilter: import("vue").ComputedRef<boolean>;
    columnFilterValue: Ref<string[], string[]>;
    handleFilterPopupVisibleChange: (value: boolean) => void;
    setFilterValue: (filterValue: string[]) => void;
    handleCheckboxFilterChange: (values: string[]) => void;
    handleRadioFilterChange: (value: string) => void;
    handleFilterConfirm: (ev: Event) => void;
    handleFilterReset: (ev: Event) => void;
};
