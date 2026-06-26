import { Dayjs } from 'dayjs';
import { CalendarValue, ValueFormat } from '../interface';
export declare function getReturnValue(date: Dayjs, format: ValueFormat): string | number | Date;
export declare function useReturnValue(props: {
    format: ValueFormat;
}): (date: Dayjs) => string | number | Date;
export declare function getReturnRangeValue(dates: Dayjs[], format: ValueFormat): CalendarValue[];
export declare function getReturnRangeValue(dates: (Dayjs | undefined)[], format: ValueFormat): (CalendarValue | undefined)[];
