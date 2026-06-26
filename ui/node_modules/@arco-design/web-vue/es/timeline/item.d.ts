import { PropType } from 'vue';
import { DotType, LineType, PositionType } from './interface';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    dotColor: {
        type: StringConstructor;
    };
    dotType: {
        type: PropType<DotType>;
        default: string;
    };
    lineType: {
        type: PropType<LineType>;
        default: string;
    };
    lineColor: {
        type: StringConstructor;
    };
    label: {
        type: StringConstructor;
    };
    position: {
        type: PropType<PositionType>;
    };
}>, {
    cls: import("vue").ComputedRef<(string | {
        [x: string]: boolean | "horizontal" | "vertical" | import("./interface").LabelPositionType | undefined;
    })[]>;
    dotLineCls: import("vue").ComputedRef<string[]>;
    dotTypeCls: import("vue").ComputedRef<string[]>;
    prefixCls: string;
    computedDotLineStyle: import("vue").ComputedRef<{
        borderColor?: string | undefined;
    }>;
    computedDotStyle: import("vue").ComputedRef<{
        [x: string]: string | undefined;
    }>;
    labelPosition: import("vue").ComputedRef<import("./interface").LabelPositionType>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    dotColor: {
        type: StringConstructor;
    };
    dotType: {
        type: PropType<DotType>;
        default: string;
    };
    lineType: {
        type: PropType<LineType>;
        default: string;
    };
    lineColor: {
        type: StringConstructor;
    };
    label: {
        type: StringConstructor;
    };
    position: {
        type: PropType<PositionType>;
    };
}>> & Readonly<{}>, {
    dotType: DotType;
    lineType: LineType;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
