import { PropType } from 'vue';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    status: {
        type: PropType<"error" | "success" | "warning" | "info" | "403" | "404" | "500" | null>;
        default: string;
        validator: (value: any) => boolean;
    };
    title: StringConstructor;
    subtitle: StringConstructor;
}>, {
    prefixCls: string;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    status: {
        type: PropType<"error" | "success" | "warning" | "info" | "403" | "404" | "500" | null>;
        default: string;
        validator: (value: any) => boolean;
    };
    title: StringConstructor;
    subtitle: StringConstructor;
}>> & Readonly<{}>, {
    status: "error" | "success" | "warning" | "info" | "403" | "404" | "500" | null;
}, {}, {
    IconInfo: any;
    IconCheck: any;
    IconExclamation: any;
    IconClose: any;
    ResultForbidden: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    ResultNotFound: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    ResultServerError: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
