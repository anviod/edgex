import { Dayjs } from 'dayjs';
import { ComputedRef } from 'vue';
import { Mode, HeaderOperations, CalendarValue } from '../interface';
interface HeaderValueProps {
    mode?: Mode;
    value?: CalendarValue;
    defaultValue?: CalendarValue;
    selectedValue?: Dayjs;
    format: string;
    onChange?: (newVal: Dayjs) => void;
}
export default function useHeaderValue(props: HeaderValueProps): {
    headerValue: ComputedRef<Dayjs>;
    setHeaderValue: (val: Dayjs | undefined, emitChange?: boolean) => void;
    headerOperations: ComputedRef<HeaderOperations>;
    resetHeaderValue: (emitChange?: boolean) => void;
    getDefaultLocalValue: () => Dayjs;
};
export {};
