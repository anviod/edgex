import { RenderFunction, VNode } from 'vue';
export interface DescData {
    label: string | RenderFunction;
    value: string | RenderFunction;
    span?: number;
}
export declare type DescLayout = 'horizontal' | 'vertical' | 'inline-horizontal' | 'inline-vertical';
export interface DescItemData {
    index: number;
    span: number;
}
export interface RenderData {
    data: DescData | VNode;
    span: number;
}
