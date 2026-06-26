import { PropType, VNode } from 'vue';
import { TreeNodeData } from './interface';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    loading: BooleanConstructor;
    showLine: BooleanConstructor;
    treeNodeData: {
        type: PropType<TreeNodeData>;
    };
    icons: {
        type: PropType<Record<string, (() => VNode) | undefined>>;
    };
    nodeStatus: {
        type: PropType<{
            loading?: boolean | undefined;
            checked?: boolean | undefined;
            selected?: boolean | undefined;
            expanded?: boolean | undefined;
            indeterminate?: boolean | undefined;
            isLeaf?: boolean | undefined;
        }>;
    };
}>, {
    getSwitcherIcon: () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[] | undefined;
    getLoadingIcon: () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[] | undefined;
    onClick(e: Event): void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "click"[], "click", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    loading: BooleanConstructor;
    showLine: BooleanConstructor;
    treeNodeData: {
        type: PropType<TreeNodeData>;
    };
    icons: {
        type: PropType<Record<string, (() => VNode) | undefined>>;
    };
    nodeStatus: {
        type: PropType<{
            loading?: boolean | undefined;
            checked?: boolean | undefined;
            selected?: boolean | undefined;
            expanded?: boolean | undefined;
            indeterminate?: boolean | undefined;
            isLeaf?: boolean | undefined;
        }>;
    };
}>> & Readonly<{
    onClick?: ((...args: any[]) => any) | undefined;
}>, {
    loading: boolean;
    showLine: boolean;
}, {}, {
    IconLoading: any;
    RenderFunction: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        renderFunc: {
            type: PropType<import("../_components/render-function").RenderFunc>;
            required: true;
        };
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        renderFunc: {
            type: PropType<import("../_components/render-function").RenderFunc>;
            required: true;
        };
    }>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
