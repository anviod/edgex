import { PropType } from 'vue';
import { Dayjs } from 'dayjs';
import type { Cell, DisabledDate, HeaderIcons, HeaderOperations, IsSameTime } from '../../interface';
import { HeaderLabelClickFunc } from '../header';
import { RenderFunc } from '../../../_components/render-function';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    headerValue: {
        type: PropType<Dayjs>;
        required: true;
    };
    headerOperations: {
        type: PropType<HeaderOperations>;
        default: () => {};
    };
    headerIcons: {
        type: PropType<HeaderIcons>;
        default: () => {};
    };
    value: {
        type: PropType<Dayjs>;
    };
    disabledDate: {
        type: PropType<DisabledDate>;
    };
    rangeValues: {
        type: PropType<(Dayjs | undefined)[]>;
    };
    dateRender: {
        type: PropType<RenderFunc>;
    };
    onHeaderLabelClick: {
        type: PropType<HeaderLabelClickFunc>;
    };
}>, {
    prefixCls: import("vue").ComputedRef<string>;
    pickerPrefixCls: string;
    headerTitle: import("vue").ComputedRef<string>;
    rows: import("vue").ComputedRef<Cell[][]>;
    isSameTime: IsSameTime;
    onCellClick: (cellData: Cell) => void;
    onCellMouseEnter: (cellData: Cell) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("select" | "cell-mouse-enter")[], "select" | "cell-mouse-enter", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    headerValue: {
        type: PropType<Dayjs>;
        required: true;
    };
    headerOperations: {
        type: PropType<HeaderOperations>;
        default: () => {};
    };
    headerIcons: {
        type: PropType<HeaderIcons>;
        default: () => {};
    };
    value: {
        type: PropType<Dayjs>;
    };
    disabledDate: {
        type: PropType<DisabledDate>;
    };
    rangeValues: {
        type: PropType<(Dayjs | undefined)[]>;
    };
    dateRender: {
        type: PropType<RenderFunc>;
    };
    onHeaderLabelClick: {
        type: PropType<HeaderLabelClickFunc>;
    };
}>> & Readonly<{
    onSelect?: ((...args: any[]) => any) | undefined;
    "onCell-mouse-enter"?: ((...args: any[]) => any) | undefined;
}>, {
    headerOperations: HeaderOperations;
    headerIcons: HeaderIcons;
}, {}, {
    PanelHeader: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        prefixCls: {
            type: StringConstructor;
            required: true;
        };
        title: {
            type: StringConstructor;
            required: true;
        };
        mode: {
            type: PropType<import("../../interface").Mode>;
            default: string;
        };
        value: {
            type: PropType<Dayjs>;
        };
        icons: {
            type: PropType<HeaderIcons>;
        };
        onPrev: {
            type: PropType<(payload: MouseEvent) => void>;
        };
        onSuperPrev: {
            type: PropType<(payload: MouseEvent) => void>;
        };
        onNext: {
            type: PropType<(payload: MouseEvent) => void>;
        };
        onSuperNext: {
            type: PropType<(payload: MouseEvent) => void>;
        };
        onLabelClick: {
            type: PropType<HeaderLabelClickFunc>;
        };
    }>, {
        showPrev: import("vue").ComputedRef<boolean>;
        showSuperPrev: import("vue").ComputedRef<boolean>;
        showNext: import("vue").ComputedRef<boolean>;
        showSuperNext: import("vue").ComputedRef<boolean>;
        year: import("vue").ComputedRef<string>;
        month: import("vue").ComputedRef<string>;
        getIconClassName: (show?: boolean | undefined) => (string | {
            [x: string]: boolean;
        })[];
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "label-click"[], "label-click", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        prefixCls: {
            type: StringConstructor;
            required: true;
        };
        title: {
            type: StringConstructor;
            required: true;
        };
        mode: {
            type: PropType<import("../../interface").Mode>;
            default: string;
        };
        value: {
            type: PropType<Dayjs>;
        };
        icons: {
            type: PropType<HeaderIcons>;
        };
        onPrev: {
            type: PropType<(payload: MouseEvent) => void>;
        };
        onSuperPrev: {
            type: PropType<(payload: MouseEvent) => void>;
        };
        onNext: {
            type: PropType<(payload: MouseEvent) => void>;
        };
        onSuperNext: {
            type: PropType<(payload: MouseEvent) => void>;
        };
        onLabelClick: {
            type: PropType<HeaderLabelClickFunc>;
        };
    }>> & Readonly<{
        "onLabel-click"?: ((...args: any[]) => any) | undefined;
    }>, {
        mode: import("../../interface").Mode;
    }, {}, {
        IconLeft: any;
        IconRight: any;
        IconDoubleLeft: any;
        IconDoubleRight: any;
        RenderFunction: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
            renderFunc: {
                type: PropType<RenderFunc>;
                required: true;
            };
        }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
            renderFunc: {
                type: PropType<RenderFunc>;
                required: true;
            };
        }>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    }, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    PanelBody: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        prefixCls: {
            type: StringConstructor;
            required: true;
        };
        rows: {
            type: PropType<Cell[][]>;
            default: () => never[];
        };
        value: {
            type: PropType<Dayjs>;
        };
        disabledDate: {
            type: PropType<DisabledDate>;
        };
        isSameTime: {
            type: PropType<IsSameTime>;
            required: true;
        };
        mode: {
            type: PropType<import("../../interface").Mode>;
        };
        rangeValues: {
            type: PropType<(Dayjs | undefined)[]>;
        };
        dateRender: {
            type: PropType<RenderFunc>;
        };
    }>, {
        isWeek: import("vue").ComputedRef<boolean>;
        getCellClassName: (cellData: Cell) => (string | {
            [x: string]: boolean | undefined;
        } | undefined)[];
        onCellClick: (cellData: Cell) => void;
        onCellMouseEnter: (cellData: Cell) => void;
        onCellMouseLeave: (cellData: Cell) => void;
        getDateValue: typeof import("../../../_utils/date").getDateValue;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("cell-click" | "cell-mouse-enter")[], "cell-click" | "cell-mouse-enter", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        prefixCls: {
            type: StringConstructor;
            required: true;
        };
        rows: {
            type: PropType<Cell[][]>;
            default: () => never[];
        };
        value: {
            type: PropType<Dayjs>;
        };
        disabledDate: {
            type: PropType<DisabledDate>;
        };
        isSameTime: {
            type: PropType<IsSameTime>;
            required: true;
        };
        mode: {
            type: PropType<import("../../interface").Mode>;
        };
        rangeValues: {
            type: PropType<(Dayjs | undefined)[]>;
        };
        dateRender: {
            type: PropType<RenderFunc>;
        };
    }>> & Readonly<{
        "onCell-click"?: ((...args: any[]) => any) | undefined;
        "onCell-mouse-enter"?: ((...args: any[]) => any) | undefined;
    }>, {
        rows: Cell[][];
    }, {}, {
        RenderFunction: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
            renderFunc: {
                type: PropType<RenderFunc>;
                required: true;
            };
        }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
            renderFunc: {
                type: PropType<RenderFunc>;
                required: true;
            };
        }>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    }, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
