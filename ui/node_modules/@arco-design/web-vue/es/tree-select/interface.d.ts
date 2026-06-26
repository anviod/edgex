import { CSSProperties } from 'vue';
import { TreeFieldNames, TreeNodeData, TreeProps, TreeNodeKey, LoadMore, CheckedStrategy } from '../tree/interface';
import { TriggerProps } from '../trigger';
import { Size } from '../_utils/constant';
export interface LabelValue {
    value: TreeNodeKey;
    label: string | number;
}
export declare type TreeSelectValue = TreeNodeKey | TreeNodeKey[] | LabelValue | LabelValue[];
export declare type FilterTreeNode = (searchKey: string, nodeData: TreeNodeData) => boolean;
export declare type FallbackOption = boolean | ((key: TreeNodeKey) => TreeNodeData | boolean);
export declare type ChangeHandler = (selectedValue: TreeSelectValue | undefined) => void;
export declare type PopupVisibleChangeHandler = (popupVisible: boolean) => void;
export declare type SearchHandler = (searchKey: string) => void;
export declare type ClearHandler = () => void;
export interface TreeSelectProps {
    disabled: boolean;
    loading: boolean;
    error: boolean;
    size: Size;
    border: boolean;
    allowSearch: boolean;
    allowClear: boolean;
    placeholder: string | undefined;
    retainInputValue: boolean;
    maxTagCount: number | undefined;
    defaultValue: TreeSelectValue | undefined;
    modelValue: TreeSelectValue | undefined;
    multiple: boolean;
    fieldNames: TreeFieldNames | undefined;
    data: TreeNodeData[];
    labelInValue: boolean;
    treeCheckable: boolean;
    treeCheckStrictly: boolean;
    treeCheckedStrategy: CheckedStrategy;
    treeProps: Partial<TreeProps> | undefined;
    triggerProps: Partial<TriggerProps> | undefined;
    popupVisible: boolean | undefined;
    defaultPopupVisible: boolean;
    dropdownStyle: CSSProperties | undefined;
    dropdownClassName: string | string[] | undefined;
    filterTreeNode: FilterTreeNode | undefined;
    loadMore: LoadMore | undefined;
    disableFilter: boolean;
    popupContainer?: string | HTMLElement;
    fallbackOption: FallbackOption;
    showHeaderOnEmpty?: boolean;
    showFooterOnEmpty?: boolean;
}
