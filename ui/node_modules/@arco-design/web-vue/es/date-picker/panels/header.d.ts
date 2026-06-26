import { PropType } from 'vue';
import { Dayjs } from 'dayjs';
import { HeaderIcons, Mode } from '../interface';
declare type ClickCallbackFunc = (payload: MouseEvent) => void;
export declare type HeaderLabelClickFunc = (label: 'year' | 'month') => void;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: {
        type: StringConstructor;
        required: true;
    };
    title: {
        type: StringConstructor;
        required: true;
    };
    mode: {
        type: PropType<Mode>;
        default: string;
    };
    value: {
        type: PropType<Dayjs>;
    };
    icons: {
        type: PropType<HeaderIcons>;
    };
    onPrev: {
        type: PropType<ClickCallbackFunc>;
    };
    onSuperPrev: {
        type: PropType<ClickCallbackFunc>;
    };
    onNext: {
        type: PropType<ClickCallbackFunc>;
    };
    onSuperNext: {
        type: PropType<ClickCallbackFunc>;
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
        type: PropType<Mode>;
        default: string;
    };
    value: {
        type: PropType<Dayjs>;
    };
    icons: {
        type: PropType<HeaderIcons>;
    };
    onPrev: {
        type: PropType<ClickCallbackFunc>;
    };
    onSuperPrev: {
        type: PropType<ClickCallbackFunc>;
    };
    onNext: {
        type: PropType<ClickCallbackFunc>;
    };
    onSuperNext: {
        type: PropType<ClickCallbackFunc>;
    };
    onLabelClick: {
        type: PropType<HeaderLabelClickFunc>;
    };
}>> & Readonly<{
    "onLabel-click"?: ((...args: any[]) => any) | undefined;
}>, {
    mode: Mode;
}, {}, {
    IconLeft: any;
    IconRight: any;
    IconDoubleLeft: any;
    IconDoubleRight: any;
    RenderFunction: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        renderFunc: {
            type: PropType<import("../../_components/render-function").RenderFunc>;
            required: true;
        };
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        renderFunc: {
            type: PropType<import("../../_components/render-function").RenderFunc>;
            required: true;
        };
    }>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
