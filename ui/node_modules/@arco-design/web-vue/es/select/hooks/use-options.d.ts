import type { Ref } from 'vue';
import type { FilterOption, SelectOption, SelectOptionInfo, SelectFieldNames } from '../interface';
export declare const useOptions: ({ options, extraOptions, inputValue, filterOption, showExtraOptions, valueKey, fieldNames, }: {
    options?: Ref<SelectOption[], SelectOption[]> | undefined;
    extraOptions?: Ref<SelectOption[], SelectOption[]> | undefined;
    inputValue?: Ref<string, string> | undefined;
    filterOption?: Ref<FilterOption, FilterOption> | undefined;
    showExtraOptions?: Ref<boolean, boolean> | undefined;
    valueKey?: Ref<string, string> | undefined;
    fieldNames?: Ref<import("../../_utils/types").FieldString<import("../interface").SelectOptionData> | undefined, import("../../_utils/types").FieldString<import("../interface").SelectOptionData> | undefined> | undefined;
}) => {
    validOptions: import("vue").ComputedRef<(SelectOptionInfo | import("../interface").SelectOptionGroupInfo)[]>;
    optionInfoMap: import("vue").Reactive<Map<string, SelectOptionInfo>>;
    validOptionInfos: import("vue").ComputedRef<{
        [x: string]: any;
        raw: Record<string, unknown>;
        key: string;
        index?: number | undefined;
        origin: "slot" | "options" | "extraOptions";
        value: import("../interface").SelectOptionValue;
        label: string;
        disabled?: boolean | undefined;
        tagProps?: any;
        render?: import("vue").RenderFunction | undefined;
    }[]>;
    enabledOptionKeys: import("vue").ComputedRef<string[]>;
    getNextSlotOptionIndex: () => number;
    addSlotOptionInfo: (id: number, optionInfo: SelectOptionInfo) => void;
    removeSlotOptionInfo: (id: number) => void;
};
