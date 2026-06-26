import { PropType, VNodeTypes } from 'vue';
export declare type RenderFunc = (props: Record<string, unknown>) => VNodeTypes;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
export default _default;
