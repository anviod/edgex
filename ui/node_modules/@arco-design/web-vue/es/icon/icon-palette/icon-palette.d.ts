import { CSSProperties } from 'vue';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    size: {
        type: (NumberConstructor | StringConstructor)[];
    };
    strokeWidth: {
        type: NumberConstructor;
        default: number;
    };
    strokeLinecap: {
        type: StringConstructor;
        default: string;
        validator: (value: any) => boolean;
    };
    strokeLinejoin: {
        type: StringConstructor;
        default: string;
        validator: (value: any) => boolean;
    };
    rotate: NumberConstructor;
    spin: BooleanConstructor;
}>, {
    cls: import("vue").ComputedRef<(string | {
        [x: string]: boolean;
    })[]>;
    innerStyle: import("vue").ComputedRef<CSSProperties>;
    onClick: (ev: MouseEvent) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (ev: MouseEvent) => true;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    size: {
        type: (NumberConstructor | StringConstructor)[];
    };
    strokeWidth: {
        type: NumberConstructor;
        default: number;
    };
    strokeLinecap: {
        type: StringConstructor;
        default: string;
        validator: (value: any) => boolean;
    };
    strokeLinejoin: {
        type: StringConstructor;
        default: string;
        validator: (value: any) => boolean;
    };
    rotate: NumberConstructor;
    spin: BooleanConstructor;
}>> & Readonly<{
    onClick?: ((ev: MouseEvent) => any) | undefined;
}>, {
    strokeWidth: number;
    strokeLinecap: string;
    strokeLinejoin: string;
    spin: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
