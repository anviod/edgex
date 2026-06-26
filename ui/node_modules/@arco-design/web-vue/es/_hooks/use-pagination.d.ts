export declare const usePagination: (props: any, { emit }: {
    emit: any;
}) => {
    current: import("vue").ComputedRef<any>;
    pageSize: import("vue").ComputedRef<any>;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (pageSize: number) => void;
};
