import { PropType } from 'vue';
import { TableColumnData, TableOperationColumn } from './interface';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    column: {
        type: PropType<TableColumnData>;
        default: () => {};
    };
    operations: {
        type: PropType<TableOperationColumn[]>;
        default: () => never[];
    };
    dataColumns: {
        type: PropType<TableColumnData[]>;
        default: () => never[];
    };
    resizable: BooleanConstructor;
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    column: {
        type: PropType<TableColumnData>;
        default: () => {};
    };
    operations: {
        type: PropType<TableOperationColumn[]>;
        default: () => never[];
    };
    dataColumns: {
        type: PropType<TableColumnData[]>;
        default: () => never[];
    };
    resizable: BooleanConstructor;
}>> & Readonly<{}>, {
    column: TableColumnData;
    operations: TableOperationColumn[];
    dataColumns: TableColumnData[];
    resizable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
