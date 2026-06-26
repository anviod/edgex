import type { App } from 'vue';
import type { ArcoOptions } from '../_utils/types';
import _Skeleton from './skeleton';
import _SkeletonLine from './line';
import _SkeletonShape from './shape';
declare const Skeleton: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        loading: {
            type: BooleanConstructor;
            default: boolean;
        };
        animation: {
            type: BooleanConstructor;
            default: boolean;
        };
    }>> & Readonly<{}>, {
        prefixCls: string;
        cls: import("vue").ComputedRef<(string | {
            [x: string]: boolean;
        })[]>;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        loading: boolean;
        animation: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        loading: {
            type: BooleanConstructor;
            default: boolean;
        };
        animation: {
            type: BooleanConstructor;
            default: boolean;
        };
    }>> & Readonly<{}>, {
        prefixCls: string;
        cls: import("vue").ComputedRef<(string | {
            [x: string]: boolean;
        })[]>;
    }, {}, {}, {}, {
        loading: boolean;
        animation: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
    animation: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, {
    prefixCls: string;
    cls: import("vue").ComputedRef<(string | {
        [x: string]: boolean;
    })[]>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    loading: boolean;
    animation: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    Line: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        rows: {
            type: NumberConstructor;
            default: number;
        };
        widths: {
            type: import("vue").PropType<(string | number)[]>;
            default: () => never[];
        };
        lineHeight: {
            type: NumberConstructor;
            default: number;
        };
        lineSpacing: {
            type: NumberConstructor;
            default: number;
        };
    }>, {
        prefixCls: string;
        lines: import("vue").CSSProperties[];
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        rows: {
            type: NumberConstructor;
            default: number;
        };
        widths: {
            type: import("vue").PropType<(string | number)[]>;
            default: () => never[];
        };
        lineHeight: {
            type: NumberConstructor;
            default: number;
        };
        lineSpacing: {
            type: NumberConstructor;
            default: number;
        };
    }>> & Readonly<{}>, {
        lineHeight: number;
        rows: number;
        widths: (string | number)[];
        lineSpacing: number;
    }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    Shape: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        shape: {
            type: import("vue").PropType<"circle" | "square">;
            default: string;
        };
        size: {
            type: StringConstructor;
            default: string;
        };
    }>, {
        prefixCls: string;
        cls: import("vue").ComputedRef<string[]>;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        shape: {
            type: import("vue").PropType<"circle" | "square">;
            default: string;
        };
        size: {
            type: StringConstructor;
            default: string;
        };
    }>> & Readonly<{}>, {
        size: string;
        shape: "circle" | "square";
    }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    install: (app: App, options?: ArcoOptions | undefined) => void;
};
export declare type SkeletonInstance = InstanceType<typeof _Skeleton>;
export declare type SkeletonLineInstance = InstanceType<typeof _SkeletonLine>;
export declare type SkeletonShapeInstance = InstanceType<typeof _SkeletonShape>;
export { _SkeletonLine as SkeletonLine, _SkeletonShape as SkeletonShape };
export default Skeleton;
