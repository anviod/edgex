import { PropType } from 'vue';
import { TableDataWithRaw } from './interface';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    expand: {
        type: BooleanConstructor;
    };
    empty: {
        type: BooleanConstructor;
    };
    checked: {
        type: BooleanConstructor;
    };
    rowIndex: NumberConstructor;
    record: {
        type: PropType<TableDataWithRaw>;
        default: () => {};
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    expand: {
        type: BooleanConstructor;
    };
    empty: {
        type: BooleanConstructor;
    };
    checked: {
        type: BooleanConstructor;
    };
    rowIndex: NumberConstructor;
    record: {
        type: PropType<TableDataWithRaw>;
        default: () => {};
    };
}>> & Readonly<{}>, {
    empty: boolean;
    expand: boolean;
    checked: boolean;
    record: TableDataWithRaw;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
