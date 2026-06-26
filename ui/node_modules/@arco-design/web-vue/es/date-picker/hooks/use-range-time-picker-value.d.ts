import { ComputedRef } from 'vue';
import { Dayjs } from 'dayjs';
import { TimePickerProps } from '../../time-picker/interface';
interface RangeTimePickerValueProps {
    timePickerProps?: Partial<TimePickerProps>;
    selectedValue: Array<Dayjs | undefined> | undefined;
}
export default function useRangeTimePickerValue(props: RangeTimePickerValueProps): [
    ComputedRef<Dayjs[]>,
    (val: Array<Dayjs | undefined> | undefined) => void,
    () => void
];
export {};
