import { Ref } from 'vue';
import { TableColumnData, TableData, TableDataWithRaw, TableOperationColumn } from '../interface';
export declare const useSpan: ({ spanMethod, data, columns, }: {
    spanMethod: Ref<((data: {
        record: TableData;
        column: TableColumnData | TableOperationColumn;
        rowIndex: number;
        columnIndex: number;
    }) => {
        rowspan?: number;
        colspan?: number;
    } | void) | undefined, ((data: {
        record: TableData;
        column: TableColumnData | TableOperationColumn;
        rowIndex: number;
        columnIndex: number;
    }) => {
        rowspan?: number;
        colspan?: number;
    } | void) | undefined>;
    data: Ref<TableDataWithRaw[]>;
    columns: Ref<(TableColumnData | TableOperationColumn)[]>;
}) => {
    tableSpan: import("vue").ComputedRef<Record<string, [number, number]>>;
    removedCells: import("vue").ComputedRef<string[]>;
};
