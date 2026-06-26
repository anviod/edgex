import { Ref } from 'vue';
import type { TableData, TableExpandable } from '../interface';
import type { BaseType, EmitFn2 } from '../../_utils/types';
export declare const useExpand: ({ expandedKeys, defaultExpandedKeys, defaultExpandAllRows, expandable, allRowKeys, emit, }: {
    expandedKeys: Ref<BaseType[] | undefined>;
    defaultExpandedKeys: Ref<BaseType[] | undefined>;
    defaultExpandAllRows: Ref<boolean>;
    expandable: Ref<TableExpandable | undefined>;
    allRowKeys: Ref<BaseType[]>;
    emit: ((event: "update:expandedKeys", rowKeys: BaseType[]) => void) & ((event: "expand", rowKey: BaseType, record: TableData) => void) & ((event: "expandedChange", rowKeys: BaseType[]) => void);
}) => {
    expandedRowKeys: import("vue").ComputedRef<BaseType[]>;
    handleExpand: (rowKey: BaseType, record: TableData) => void;
    expand: (rowKey: BaseType | BaseType[], expanded?: boolean) => void;
    expandAll: (expanded?: boolean) => void;
};
