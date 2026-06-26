import { Ref } from 'vue';
import { Dayjs } from 'dayjs';
import { TimePickerProps } from '../../time-picker/interface';
interface TimePickerValueProps {
    timePickerProps: Partial<TimePickerProps> | undefined;
    selectedValue: Dayjs | undefined;
}
export default function useTimePickerValue(props: TimePickerValueProps): [Ref<Dayjs>, (val: Dayjs | undefined) => void, () => void];
export {};
