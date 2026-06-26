import { TableProps } from '../interface';
export declare const usePagination: (props: TableProps, emit: any) => {
    page: import("vue").ComputedRef<any>;
    pageSize: import("vue").ComputedRef<any>;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (pageSize: number) => void;
};
