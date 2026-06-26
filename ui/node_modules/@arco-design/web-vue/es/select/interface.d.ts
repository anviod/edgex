import type { RenderFunction } from 'vue';
import { FieldString } from '../_utils/types';
import { Size } from '../_utils/constant';
import { VirtualListProps } from '../_components/virtual-list-v2/interface';
import { TriggerProps } from '../trigger';
export interface SelectProps {
    options?: (string | number | boolean | SelectOptionData | SelectOptionGroup)[];
    multiple?: boolean;
    modelValue?: string | number | boolean | Record<string, unknown> | (string | number | boolean | Record<string, unknown>)[];
    defaultValue?: string | number | boolean | Record<string, unknown> | (string | number | boolean | Record<string, unknown>)[];
    inputValue?: string;
    defaultInputValue?: string;
    size?: Size;
    placeholder?: string;
    loading?: boolean;
    disabled?: boolean;
    error?: boolean;
    allowClear?: boolean;
    allowSearch?: boolean | {
        retainInputValue?: boolean;
    };
    allowCreate?: boolean;
    maxTagCount?: number;
    popupContainer?: string | HTMLElement;
    bordered?: boolean;
    popupVisible?: boolean;
    defaultPopupVisible?: boolean;
    unmountOnClose?: boolean;
    filterOption?: boolean | ((inputValue: string, option: SelectOptionData) => boolean);
    virtualListProps?: VirtualListProps;
    triggerProps?: TriggerProps;
    formatLabel?: (data: SelectOptionData) => string;
    fallbackOption?: boolean | ((value: string | number | boolean | Record<string, unknown>) => SelectOptionData);
    showExtraOptions?: boolean;
    valueKey?: string;
    searchDelay?: number;
    limit?: number;
    fieldNames?: SelectFieldNames;
    showHeaderOnEmpty?: boolean;
    showFooterOnEmpty?: boolean;
}
export declare type SelectOptionValue = string | number | boolean | Record<string, unknown>;
export interface OptionValueWithKey {
    value: SelectOptionValue;
    key: string;
}
export declare type SelectFieldNames = FieldString<SelectOptionData>;
export interface SelectOptionData {
    value?: string | number | boolean | Record<string, unknown>;
    label?: string;
    disabled?: boolean;
    tagProps?: any;
    render?: RenderFunction;
    [other: string]: any;
}
export interface SelectOptionGroup {
    isGroup: true;
    label: string;
    options: SelectOption[];
    [other: string]: any;
}
export declare type SelectOption = string | number | boolean | SelectOptionData | SelectOptionGroup;
export interface SelectOptionInfo extends SelectOptionData {
    raw: Record<string, unknown>;
    key: string;
    index?: number;
    origin: 'slot' | 'options' | 'extraOptions';
    value: SelectOptionValue;
    label: string;
}
export interface SelectOptionGroupInfo extends SelectOptionGroup {
    key: string;
    options: (SelectOptionInfo | SelectOptionGroupInfo)[];
}
export declare type FilterOption = boolean | ((inputValue: string, option: SelectOptionData) => boolean);
