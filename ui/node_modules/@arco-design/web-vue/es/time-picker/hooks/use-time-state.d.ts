import { Dayjs } from 'dayjs';
import { TimeValue } from '../interface';
export default function useTimeState(props: {
    modelValue: TimeValue | TimeValue[] | undefined;
    defaultValue: TimeValue | TimeValue[] | undefined;
    format: string;
    isRange: boolean;
}): {
    computedValue: import("vue").ComputedRef<Dayjs | (Dayjs | undefined)[] | undefined>;
    panelValue: import("vue").Ref<Dayjs | (Dayjs | undefined)[] | undefined, Dayjs | (Dayjs | undefined)[] | undefined>;
    inputValue: import("vue").Ref<string | (string | undefined)[] | undefined, string | (string | undefined)[] | undefined>;
    setValue: (newValue: Dayjs | (Dayjs | undefined)[] | undefined) => void;
    setPanelValue: (newValue: Dayjs | (Dayjs | undefined)[] | undefined) => void;
    setInputValue: (newValue: string | (string | undefined)[] | undefined) => void;
};
