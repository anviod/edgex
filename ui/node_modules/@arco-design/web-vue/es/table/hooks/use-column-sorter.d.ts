import type { Ref } from 'vue';
import type { TableColumnData } from '../interface';
import type { TableContext } from '../context';
export declare const useColumnSorter: ({ column, tableCtx, }: {
    column: Ref<TableColumnData>;
    tableCtx: Partial<TableContext>;
}) => {
    sortOrder: import("vue").ComputedRef<"ascend" | "descend" | undefined>;
    hasSorter: import("vue").ComputedRef<boolean>;
    hasAscendBtn: import("vue").ComputedRef<boolean>;
    hasDescendBtn: import("vue").ComputedRef<boolean>;
    nextSortOrder: import("vue").ComputedRef<"" | "ascend" | "descend">;
    handleClickSorter: (ev: Event) => void;
};
