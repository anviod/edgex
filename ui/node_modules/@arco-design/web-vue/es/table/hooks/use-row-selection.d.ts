import type { Ref } from 'vue';
import type { BaseType, EmitFn2 } from '../../_utils/types';
import type { TableDataWithRaw, TableRowSelection } from '../interface';
import { TableData } from '../interface';
export declare const useRowSelection: ({ selectedKeys, defaultSelectedKeys, rowSelection, currentAllRowKeys, currentAllEnabledRowKeys, emit, }: {
    selectedKeys: Ref<BaseType[] | undefined>;
    defaultSelectedKeys: Ref<BaseType[] | undefined>;
    rowSelection: Ref<TableRowSelection | undefined>;
    currentAllRowKeys: Ref<BaseType[]>;
    currentAllEnabledRowKeys: Ref<BaseType[]>;
    emit: ((event: "select", rowKeys: BaseType[], rowKey: BaseType, record: TableData) => void) & ((event: "update:selectedKeys", rowKeys: BaseType[]) => void) & ((event: "selectAll", checked: boolean) => void) & ((event: "selectionChange", rowKeys: BaseType[]) => void);
}) => {
    isRadio: import("vue").ComputedRef<boolean>;
    selectedRowKeys: import("vue").ComputedRef<BaseType[]>;
    currentSelectedRowKeys: import("vue").ComputedRef<BaseType[]>;
    handleSelectAll: (checked: boolean) => void;
    handleSelect: (checked: boolean, record: TableDataWithRaw) => void;
    handleSelectAllLeafs: (record: TableDataWithRaw, checked: boolean) => void;
    select: (rowKey: BaseType | BaseType[], checked?: boolean) => void;
    selectAll: (checked?: boolean) => void;
    clearSelected: () => void;
};
