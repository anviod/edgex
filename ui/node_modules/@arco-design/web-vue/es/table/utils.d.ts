import type { CSSProperties, VNode } from 'vue';
import { TableColumnData, TableDataWithRaw, TableOperationColumn } from './interface';
import { BaseType } from '../_utils/types';
export declare const getGroupColumns: (columns: TableColumnData[], columnMap: Map<string, TableColumnData>, columnWidth: Record<string, number>) => {
    dataColumns: TableColumnData[];
    groupColumns: TableColumnData[][];
};
export declare const getOperationFixedNumber: (column: TableOperationColumn, operations: TableOperationColumn[]) => number;
export declare const getFixedNumber: (column: TableColumnData, { dataColumns, operations, }: {
    dataColumns: TableColumnData[];
    operations: TableOperationColumn[];
}) => number;
export declare const getOperationFixedCls: (prefixCls: string, column: TableOperationColumn) => any[];
export declare const getFixedCls: (prefixCls: string, column: Pick<TableColumnData, 'fixed' | 'isLastLeftFixed' | 'isFirstRightFixed'>) => any[];
export declare const getStyle: (column: TableColumnData, { dataColumns, operations, }: {
    dataColumns: TableColumnData[];
    operations: TableOperationColumn[];
}) => CSSProperties;
export declare const getOperationStyle: (column: TableOperationColumn, operations: TableOperationColumn[]) => {
    left: string;
} | {
    left?: undefined;
};
export declare const getColumnsFromSlot: (vns: VNode[]) => TableColumnData[];
export declare function mapArrayWithChildren<T extends Array<{
    [key: string]: any;
    children?: T;
}>>(arr: T): T;
export declare function mapRawTableData<T extends TableDataWithRaw[]>(arr: T): TableDataWithRaw['raw'][];
export declare const getLeafKeys: (record: TableDataWithRaw) => BaseType[];
export declare const getSelectionStatus: (selectedRowKeys: BaseType[], leafKeys: BaseType[]) => {
    checked: boolean;
    indeterminate: boolean;
};
