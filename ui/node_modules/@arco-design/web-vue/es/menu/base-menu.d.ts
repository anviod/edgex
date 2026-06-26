import { CSSProperties, PropType, StyleValue } from 'vue';
import { TriggerProps } from '../trigger';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    style: {
        type: PropType<StyleValue>;
    };
    theme: {
        type: PropType<"dark" | "light">;
        default: string;
    };
    mode: {
        type: PropType<"pop" | "horizontal" | "vertical" | "popButton">;
        default: string;
    };
    levelIndent: {
        type: NumberConstructor;
    };
    autoOpen: {
        type: BooleanConstructor;
    };
    collapsed: {
        type: BooleanConstructor;
        default: undefined;
    };
    defaultCollapsed: {
        type: BooleanConstructor;
    };
    collapsedWidth: {
        type: NumberConstructor;
    };
    accordion: {
        type: BooleanConstructor;
    };
    autoScrollIntoView: {
        type: BooleanConstructor;
    };
    showCollapseButton: {
        type: BooleanConstructor;
    };
    selectedKeys: {
        type: PropType<string[]>;
    };
    defaultSelectedKeys: {
        type: PropType<string[]>;
        default: () => never[];
    };
    openKeys: {
        type: PropType<string[]>;
    };
    defaultOpenKeys: {
        type: PropType<string[]>;
        default: () => never[];
    };
    scrollConfig: {
        type: PropType<{
            [key: string]: any;
        }>;
    };
    triggerProps: {
        type: PropType<TriggerProps>;
    };
    tooltipProps: {
        type: ObjectConstructor;
    };
    autoOpenSelected: {
        type: BooleanConstructor;
    };
    breakpoint: {
        type: PropType<"xxl" | "xl" | "lg" | "md" | "sm" | "xs">;
    };
    popupMaxHeight: {
        type: PropType<number | boolean>;
        default: boolean;
    };
    prefixCls: {
        type: StringConstructor;
    };
    inTrigger: {
        type: BooleanConstructor;
    };
    siderCollapsed: {
        type: BooleanConstructor;
    };
    isRoot: {
        type: BooleanConstructor;
    };
}>, {
    computedPrefixCls: import("vue").ComputedRef<string>;
    classNames: import("vue").ComputedRef<(string | {
        [x: string]: boolean;
    })[]>;
    computedStyle: import("vue").ComputedRef<(string | false | StyleValue[] | Omit<CSSProperties, "width"> | {
        width: string | number | undefined;
    } | null | undefined)[]>;
    computedCollapsed: import("vue").ComputedRef<boolean>;
    computedHasCollapseButton: import("vue").ComputedRef<boolean>;
    onCollapseBtnClick: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("collapse" | "update:collapsed" | "update:selectedKeys" | "update:openKeys" | "menu-item-click" | "sub-menu-click")[], "collapse" | "update:collapsed" | "update:selectedKeys" | "update:openKeys" | "menu-item-click" | "sub-menu-click", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    style: {
        type: PropType<StyleValue>;
    };
    theme: {
        type: PropType<"dark" | "light">;
        default: string;
    };
    mode: {
        type: PropType<"pop" | "horizontal" | "vertical" | "popButton">;
        default: string;
    };
    levelIndent: {
        type: NumberConstructor;
    };
    autoOpen: {
        type: BooleanConstructor;
    };
    collapsed: {
        type: BooleanConstructor;
        default: undefined;
    };
    defaultCollapsed: {
        type: BooleanConstructor;
    };
    collapsedWidth: {
        type: NumberConstructor;
    };
    accordion: {
        type: BooleanConstructor;
    };
    autoScrollIntoView: {
        type: BooleanConstructor;
    };
    showCollapseButton: {
        type: BooleanConstructor;
    };
    selectedKeys: {
        type: PropType<string[]>;
    };
    defaultSelectedKeys: {
        type: PropType<string[]>;
        default: () => never[];
    };
    openKeys: {
        type: PropType<string[]>;
    };
    defaultOpenKeys: {
        type: PropType<string[]>;
        default: () => never[];
    };
    scrollConfig: {
        type: PropType<{
            [key: string]: any;
        }>;
    };
    triggerProps: {
        type: PropType<TriggerProps>;
    };
    tooltipProps: {
        type: ObjectConstructor;
    };
    autoOpenSelected: {
        type: BooleanConstructor;
    };
    breakpoint: {
        type: PropType<"xxl" | "xl" | "lg" | "md" | "sm" | "xs">;
    };
    popupMaxHeight: {
        type: PropType<number | boolean>;
        default: boolean;
    };
    prefixCls: {
        type: StringConstructor;
    };
    inTrigger: {
        type: BooleanConstructor;
    };
    siderCollapsed: {
        type: BooleanConstructor;
    };
    isRoot: {
        type: BooleanConstructor;
    };
}>> & Readonly<{
    onCollapse?: ((...args: any[]) => any) | undefined;
    "onUpdate:collapsed"?: ((...args: any[]) => any) | undefined;
    "onUpdate:selectedKeys"?: ((...args: any[]) => any) | undefined;
    "onUpdate:openKeys"?: ((...args: any[]) => any) | undefined;
    "onMenu-item-click"?: ((...args: any[]) => any) | undefined;
    "onSub-menu-click"?: ((...args: any[]) => any) | undefined;
}>, {
    mode: "pop" | "horizontal" | "vertical" | "popButton";
    collapsed: boolean;
    theme: "dark" | "light";
    defaultCollapsed: boolean;
    accordion: boolean;
    defaultSelectedKeys: string[];
    popupMaxHeight: number | boolean;
    autoOpen: boolean;
    autoScrollIntoView: boolean;
    showCollapseButton: boolean;
    defaultOpenKeys: string[];
    autoOpenSelected: boolean;
    inTrigger: boolean;
    siderCollapsed: boolean;
    isRoot: boolean;
}, {}, {
    IconMenuFold: any;
    IconMenuUnfold: any;
}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
