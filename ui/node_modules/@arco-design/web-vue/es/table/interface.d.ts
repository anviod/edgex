import { CSSProperties, RenderFunction, Slots, VNodeChild } from 'vue';
import { BaseType, ClassName, Data } from '../_utils/types';
import { TriggerProps } from '../trigger';
export declare const TABLE_PAGE_POSITION: readonly ["tl", "top", "tr", "bl", "bottom", "br"];
export declare type TablePagePosition = typeof TABLE_PAGE_POSITION[number];
export interface TableData {
    key?: string;
    expand?: string | RenderFunction;
    children?: TableData[];
    disabled?: boolean;
    isLeaf?: boolean;
    [name: string]: any;
}
export interface TableDataWithRaw {
    raw: TableData;
    key: string;
    disabled?: boolean;
    expand?: string | RenderFunction;
    children?: TableDataWithRaw[];
    isLeaf?: boolean;
    hasSubtree?: boolean;
}
export interface TableSortable {
    sortDirections: ('ascend' | 'descend')[];
    sorter?: ((a: TableData, b: TableData, extra: {
        dataIndex: string;
        direction: 'ascend' | 'descend';
    }) => number) | boolean;
    sortOrder?: 'ascend' | 'descend' | '';
    defaultSortOrder?: 'ascend' | 'descend' | '';
}
export interface TableFilterData {
    text: string | RenderFunction;
    value: string;
}
export interface TableFilterable {
    filters?: TableFilterData[];
    filter: (filteredValue: string[], record: TableData) => boolean;
    multiple?: boolean;
    filteredValue?: string[];
    defaultFilteredValue?: string[];
    renderContent?: (data: {
        filterValue: string[];
        setFilterValue: (filterValue: string[]) => void;
        handleFilterConfirm: (event: Event) => void;
        handleFilterReset: (event: Event) => void;
    }) => VNodeChild;
    icon?: RenderFunction;
    triggerProps?: TriggerProps;
    alignLeft?: boolean;
    slotName?: string;
}
export interface TableColumnData {
    dataIndex?: string;
    title?: string | RenderFunction;
    width?: number;
    minWidth?: number;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
    ellipsis?: boolean;
    tooltip?: boolean | Record<string, any>;
    sortable?: TableSortable;
    filterable?: TableFilterable;
    children?: TableColumnData[];
    cellClass?: ClassName;
    headerCellClass?: ClassName;
    bodyCellClass?: ClassName | ((record: TableData) => ClassName);
    summaryCellClass?: ClassName | ((record: TableData) => ClassName);
    cellStyle?: CSSProperties;
    headerCellStyle?: CSSProperties;
    bodyCellStyle?: CSSProperties | ((record: TableData) => CSSProperties);
    summaryCellStyle?: CSSProperties | ((record: TableData) => CSSProperties);
    render?: (data: {
        record: TableData;
        column: TableColumnData;
        rowIndex: number;
    }) => VNodeChild;
    slotName?: string;
    titleSlotName?: string;
    slots?: Slots;
    isLastLeftFixed?: boolean;
    isFirstRightFixed?: boolean;
    colSpan?: number;
    rowSpan?: number;
    index?: number;
    parent?: TableColumnData;
    _resizeWidth?: number;
}
export interface TableBorder {
    wrapper?: boolean;
    cell?: boolean;
    headerCell?: boolean;
    bodyCell?: boolean;
}
export interface TableRowSelection {
    type?: 'checkbox' | 'radio';
    selectedRowKeys?: BaseType[];
    defaultSelectedRowKeys?: BaseType[];
    showCheckedAll?: boolean;
    title?: string;
    width?: number;
    fixed?: boolean;
    checkStrictly?: boolean;
    onlyCurrent?: boolean;
}
export interface TableExpandable {
    expandedRowKeys?: BaseType[];
    defaultExpandedRowKeys?: BaseType[];
    defaultExpandAllRows?: boolean;
    expandedRowRender?: (record: TableData) => VNodeChild;
    icon?: (expanded: boolean, record: TableData) => VNodeChild;
    title?: string;
    width?: number;
    fixed?: boolean;
}
export interface TableDraggable {
    type?: 'row' | 'handle';
    title?: string;
    width?: number;
    fixed?: boolean;
}
export declare type OperationName = 'selection-checkbox' | 'selection-radio' | 'expand' | 'drag-handle';
export interface TableOperationColumn {
    name: OperationName | string;
    title?: string | RenderFunction;
    width?: number;
    fixed?: boolean;
    render?: (record: TableData) => VNodeChild;
    isLastLeftFixed?: boolean;
}
export interface TableComponents {
    operations: (operations: {
        dragHandle?: TableOperationColumn;
        expand?: TableOperationColumn;
        selection?: TableOperationColumn;
    }) => TableOperationColumn[];
}
export interface TableChangeExtra {
    type: 'pagination' | 'sorter' | 'filter' | 'drag';
    page?: number;
    pageSize?: number;
    sorter?: Sorter;
    filters?: Filters;
    dragTarget?: TableData;
}
export interface TableProps {
    columns: TableColumnData[];
    data: TableData[];
    bordered?: boolean | TableBorder;
    rowSelection?: TableRowSelection;
    expandable?: TableExpandable;
    pagination?: boolean | Data;
    pagePosition?: string;
}
export declare type Sorter = {
    field: string;
    direction: 'ascend' | 'descend';
};
export declare type Filters = Record<string, string[]>;
