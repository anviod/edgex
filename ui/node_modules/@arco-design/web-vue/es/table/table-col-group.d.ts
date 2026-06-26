import { PropType } from 'vue';
import { TableColumnData, TableOperationColumn } from './interface';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    dataColumns: {
        type: PropType<TableColumnData[]>;
        required: true;
    };
    operations: {
        type: PropType<TableOperationColumn[]>;
        required: true;
    };
    columnWidth: {
        type: PropType<Record<string, number>>;
    };
}>, {
    fixedWidth: (width?: number | undefined, minWidth?: number | undefined) => {
        width: string;
        minWidth: string;
        maxWidth: string;
    } | {
        minWidth: string;
        width?: undefined;
        maxWidth?: undefined;
    } | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    dataColumns: {
        type: PropType<TableColumnData[]>;
        required: true;
    };
    operations: {
        type: PropType<TableOperationColumn[]>;
        required: true;
    };
    columnWidth: {
        type: PropType<Record<string, number>>;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
