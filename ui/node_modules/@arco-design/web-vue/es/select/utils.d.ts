import type { FilterOption, SelectOptionGroup, SelectOptionGroupInfo, SelectOption, SelectOptionData, SelectOptionInfo, SelectOptionValue, SelectFieldNames } from './interface';
export declare const isGroupOption: (option: SelectOption) => option is SelectOptionGroup;
export declare const isGroupOptionInfo: (option: SelectOptionInfo | SelectOptionGroupInfo) => option is SelectOptionGroupInfo;
export declare const getValueString: (value: SelectOptionValue, valueKey?: string) => string;
export declare const getKeyFromValue: (value?: SelectOptionValue | undefined, valueKey?: string) => string;
export declare const hasEmptyStringKey: (optionInfoMap: Map<string, SelectOptionInfo>) => boolean;
export declare const createOptionInfo: (option: string | number | SelectOptionData, { valueKey, fieldNames, origin, index, }: {
    valueKey: string;
    fieldNames: Required<SelectFieldNames>;
    origin: 'slot' | 'options' | 'extraOptions';
    index?: number | undefined;
}) => SelectOptionInfo;
export declare const getOptionInfos: (options: SelectOption[], { valueKey, fieldNames, origin, optionInfoMap, }: {
    valueKey: string;
    fieldNames: Required<SelectFieldNames>;
    origin: 'options' | 'extraOptions';
    optionInfoMap: Map<string, SelectOptionInfo>;
}) => (SelectOptionInfo | SelectOptionGroupInfo)[];
export declare const createOptionInfoMap: (optionInfos: (SelectOptionInfo | SelectOptionGroupInfo)[]) => Map<string, SelectOptionInfo>;
export declare const getValidOptions: (optionInfos: (SelectOptionInfo | SelectOptionGroupInfo)[], { inputValue, filterOption, }: {
    inputValue?: string | undefined;
    filterOption?: FilterOption | undefined;
}) => (SelectOptionInfo | SelectOptionGroupInfo)[];
export declare const isValidOption: (optionInfo: SelectOptionInfo, { inputValue, filterOption, }: {
    inputValue?: string | undefined;
    filterOption?: FilterOption | undefined;
}) => boolean;
