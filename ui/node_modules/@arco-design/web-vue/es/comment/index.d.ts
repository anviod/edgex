import type { App } from 'vue';
import type { ArcoOptions } from '../_utils/types';
import _Comment from './comment';
declare const Comment: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        author: {
            type: StringConstructor;
        };
        avatar: {
            type: StringConstructor;
        };
        content: {
            type: StringConstructor;
        };
        datetime: {
            type: StringConstructor;
        };
        align: {
            type: (ObjectConstructor | StringConstructor)[];
            default: string;
        };
    }>> & Readonly<{}>, {
        prefixCls: string;
        hasAuthor: import("vue").ComputedRef<boolean>;
        hasAvatar: import("vue").ComputedRef<boolean>;
        hasContent: import("vue").ComputedRef<boolean>;
        hasDatetime: import("vue").ComputedRef<boolean>;
        computedAlign: import("vue").ComputedRef<{
            [x: string]: any;
        }>;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        align: string | Record<string, any>;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        author: {
            type: StringConstructor;
        };
        avatar: {
            type: StringConstructor;
        };
        content: {
            type: StringConstructor;
        };
        datetime: {
            type: StringConstructor;
        };
        align: {
            type: (ObjectConstructor | StringConstructor)[];
            default: string;
        };
    }>> & Readonly<{}>, {
        prefixCls: string;
        hasAuthor: import("vue").ComputedRef<boolean>;
        hasAvatar: import("vue").ComputedRef<boolean>;
        hasContent: import("vue").ComputedRef<boolean>;
        hasDatetime: import("vue").ComputedRef<boolean>;
        computedAlign: import("vue").ComputedRef<{
            [x: string]: any;
        }>;
    }, {}, {}, {}, {
        align: string | Record<string, any>;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    author: {
        type: StringConstructor;
    };
    avatar: {
        type: StringConstructor;
    };
    content: {
        type: StringConstructor;
    };
    datetime: {
        type: StringConstructor;
    };
    align: {
        type: (ObjectConstructor | StringConstructor)[];
        default: string;
    };
}>> & Readonly<{}>, {
    prefixCls: string;
    hasAuthor: import("vue").ComputedRef<boolean>;
    hasAvatar: import("vue").ComputedRef<boolean>;
    hasContent: import("vue").ComputedRef<boolean>;
    hasDatetime: import("vue").ComputedRef<boolean>;
    computedAlign: import("vue").ComputedRef<{
        [x: string]: any;
    }>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    align: string | Record<string, any>;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    install: (app: App, options?: ArcoOptions | undefined) => void;
};
export declare type CommentInstance = InstanceType<typeof _Comment>;
export default Comment;
