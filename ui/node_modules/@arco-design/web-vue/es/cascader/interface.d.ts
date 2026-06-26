import { RenderFunction } from 'vue';
import { TagProps } from '../tag';
import { BaseType, FieldString } from '../_utils/types';
export declare type CascaderBaseValue = BaseType | Record<string, any> | (BaseType | Record<string, any>)[];
export interface CascaderOption {
    value?: string | number | Record<string, any>;
    label?: string;
    render?: RenderFunction;
    disabled?: boolean;
    tagProps?: TagProps;
    children?: CascaderOption[];
    isLeaf?: boolean;
    [other: string]: any;
}
export declare type CascaderFieldNames = FieldString<CascaderOption>;
export interface CascaderOptionWithTotal extends CascaderOption {
    children?: CascaderOptionWithTotal[];
    totalLeafOptions?: number;
}
export interface CascaderNode extends CascaderOption {
    parent?: CascaderNode;
    checked?: boolean;
    indeterminate?: boolean;
    level: number;
    index: number;
    path: CascaderNode[];
    children?: CascaderNode[];
    checkedValues?: Set<string>;
    nodes: CascaderNode[];
    enabledNodes: CascaderNode[];
    raw: CascaderOption;
}
export interface CascaderOptionInfo extends CascaderOptionWithTotal {
    raw: Record<string, unknown>;
    key: string;
    valueKey: string;
    level: number;
    index: number;
    value: string | number;
    label: string;
    disabled: boolean;
    selectionDisabled: boolean;
    isLeaf: boolean;
    parent?: CascaderOptionInfo;
    children?: CascaderOptionInfo[];
    path: CascaderOptionInfo[];
    pathValue: any[];
}
