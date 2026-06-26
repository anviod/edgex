import { Dayjs } from 'dayjs';
import { CalendarValue } from '../interface';
interface PickerStateProps {
    modelValue: CalendarValue | undefined;
    defaultValue: CalendarValue | undefined;
    format: string;
}
export default function usePickerState(props: PickerStateProps): {
    value: import("vue").ComputedRef<Dayjs | undefined>;
    setValue: (newValue: Dayjs | undefined) => void;
};
export {};
