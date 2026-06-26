import { Dayjs } from 'dayjs';
import { PropType } from 'vue';
import type { Cell, DisabledDate, IsSameTime, Mode } from '../interface';
import { RenderFunc } from '../../_components/render-function';
import { getDateValue } from '../../_utils/date';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
        type: PropType<Mode>;
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
    getDateValue: typeof getDateValue;
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
        type: PropType<Mode>;
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
export default _default;
