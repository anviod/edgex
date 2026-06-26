import { Ref } from 'vue';
import { CascaderOption, CascaderOptionInfo, CascaderFieldNames } from './interface';
import { BaseType, UnionType } from '../_utils/types';
export declare const getOptionInfos: (options: CascaderOption[], { optionMap, leafOptionMap, leafOptionSet, leafOptionValueMap, totalLevel: innerLevel, checkStrictly, enabledLazyLoad, lazyLoadOptions, valueKey, fieldNames, }: {
    optionMap: Map<string, CascaderOptionInfo>;
    leafOptionMap: Map<string, CascaderOptionInfo>;
    leafOptionSet: Set<CascaderOptionInfo>;
    leafOptionValueMap: Map<BaseType, string>;
    totalLevel: Ref<number>;
    checkStrictly: Ref<boolean>;
    enabledLazyLoad: boolean;
    lazyLoadOptions: Record<string, CascaderOption[]>;
    valueKey: Ref<string>;
    fieldNames: Required<CascaderFieldNames>;
}) => CascaderOptionInfo[];
export declare const getCheckedStatus: (option: CascaderOptionInfo, valueMap?: Map<string, unknown> | undefined) => {
    checked: boolean;
    indeterminate: boolean;
};
export declare const getLeafOptionKeys: (option: CascaderOptionInfo) => string[];
export declare const getLeafOptionInfos: (option: CascaderOptionInfo) => CascaderOptionInfo[];
export declare const getValueKey: (value: UnionType | UnionType[], { valueKey, leafOptionValueMap, }: {
    valueKey: string;
    leafOptionValueMap: Map<BaseType, string>;
}) => string;
export declare const getValidValues: (value: UnionType | UnionType[] | UnionType[][] | undefined, { multiple, pathMode }: {
    multiple: boolean;
    pathMode: boolean;
}) => UnionType[] | UnionType[][];
export declare const getKeysFromValue: (value: string | number | Array<string | number> | undefined | (string | number | Array<string | number>)[], { pathMode, leafOptionMap, leafOptionValueMap, }: {
    pathMode: boolean;
    leafOptionMap: Map<string | number, CascaderOptionInfo>;
    leafOptionValueMap: Map<string | number, CascaderOptionInfo>;
}) => string[];
export declare const getOptionLabel: (option: CascaderOptionInfo) => string;
