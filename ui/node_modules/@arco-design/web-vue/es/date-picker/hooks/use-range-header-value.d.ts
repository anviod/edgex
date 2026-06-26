import { Dayjs } from 'dayjs';
import { CalendarValue, Mode } from '../interface';
interface RangeHeaderValueProps {
    mode: Mode;
    startHeaderMode?: Mode;
    endHeaderMode?: Mode;
    value: CalendarValue[] | undefined;
    defaultValue: CalendarValue[] | undefined;
    selectedValue: (Dayjs | undefined)[];
    format: string;
    onChange?: (newVal: Dayjs[]) => void;
}
export default function useRangeHeaderValue(props: RangeHeaderValueProps): {
    startHeaderValue: import("vue").ComputedRef<Dayjs>;
    endHeaderValue: import("vue").ComputedRef<Dayjs>;
    startHeaderOperations: import("vue").ComputedRef<Pick<any, string>>;
    endHeaderOperations: import("vue").ComputedRef<Pick<any, string>>;
    setHeaderValue: (newVal: Dayjs[]) => void;
    resetHeaderValue: () => void;
};
export {};
