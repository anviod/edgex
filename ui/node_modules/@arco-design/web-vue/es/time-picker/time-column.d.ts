import { PropType } from 'vue';
import { TimeList, TimeListItem } from './interface';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: {
        type: StringConstructor;
        required: true;
    };
    list: {
        type: PropType<TimeList>;
        required: true;
    };
    value: {
        type: (StringConstructor | NumberConstructor)[];
    };
    visible: {
        type: BooleanConstructor;
    };
}>, {
    refWrapper: import("vue").Ref<HTMLElement | undefined, HTMLElement | undefined>;
    refMap: import("vue").Ref<Map<string | number, HTMLElement> & Omit<Map<string | number, HTMLElement>, keyof Map<any, any>>, Map<string | number, HTMLElement> | (Map<string | number, HTMLElement> & Omit<Map<string | number, HTMLElement>, keyof Map<any, any>>)>;
    onItemRef(el: HTMLElement, item: TimeListItem): void;
    onItemClick(item: TimeListItem): void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "select"[], "select", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: {
        type: StringConstructor;
        required: true;
    };
    list: {
        type: PropType<TimeList>;
        required: true;
    };
    value: {
        type: (StringConstructor | NumberConstructor)[];
    };
    visible: {
        type: BooleanConstructor;
    };
}>> & Readonly<{
    onSelect?: ((...args: any[]) => any) | undefined;
}>, {
    visible: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
