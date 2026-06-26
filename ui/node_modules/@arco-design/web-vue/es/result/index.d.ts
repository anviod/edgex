import type { App } from 'vue';
import type { ArcoOptions } from '../_utils/types';
import _Result from './result';
declare const Result: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        status: {
            type: import("vue").PropType<"error" | "success" | "warning" | "info" | "403" | "404" | "500" | null>;
            default: string;
            validator: (value: any) => boolean;
        };
        title: StringConstructor;
        subtitle: StringConstructor;
    }>> & Readonly<{}>, {
        prefixCls: string;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        status: "error" | "success" | "warning" | "info" | "403" | "404" | "500" | null;
    }, true, {}, {}, {
        IconInfo: any;
        IconCheck: any;
        IconExclamation: any;
        IconClose: any;
        ResultForbidden: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
        ResultNotFound: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
        ResultServerError: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    } & import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        status: {
            type: import("vue").PropType<"error" | "success" | "warning" | "info" | "403" | "404" | "500" | null>;
            default: string;
            validator: (value: any) => boolean;
        };
        title: StringConstructor;
        subtitle: StringConstructor;
    }>> & Readonly<{}>, {
        prefixCls: string;
    }, {}, {}, {}, {
        status: "error" | "success" | "warning" | "info" | "403" | "404" | "500" | null;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    status: {
        type: import("vue").PropType<"error" | "success" | "warning" | "info" | "403" | "404" | "500" | null>;
        default: string;
        validator: (value: any) => boolean;
    };
    title: StringConstructor;
    subtitle: StringConstructor;
}>> & Readonly<{}>, {
    prefixCls: string;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    status: "error" | "success" | "warning" | "info" | "403" | "404" | "500" | null;
}, {}, string, {}, {
    IconInfo: any;
    IconCheck: any;
    IconExclamation: any;
    IconClose: any;
    ResultForbidden: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    ResultNotFound: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    ResultServerError: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
} & import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    install: (app: App, options?: ArcoOptions | undefined) => void;
};
export declare type ResultInstance = InstanceType<typeof _Result>;
export default Result;
