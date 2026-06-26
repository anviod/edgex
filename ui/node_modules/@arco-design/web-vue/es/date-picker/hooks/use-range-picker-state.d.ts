import { Dayjs } from 'dayjs';
import { CalendarValue } from '../interface';
interface PickerStateProps {
    modelValue: (CalendarValue | undefined)[] | undefined;
    defaultValue: (CalendarValue | undefined)[] | undefined;
    format: string;
}
export default function useRangePickerState(props: PickerStateProps): {
    value: import("vue").ComputedRef<(Dayjs | undefined)[]>;
    setValue: (newValue: (Dayjs | undefined)[]) => void;
};
export {};
