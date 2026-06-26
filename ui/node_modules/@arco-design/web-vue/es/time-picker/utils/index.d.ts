import { Dayjs } from 'dayjs';
import { TimePickerProps } from '../interface';
export declare function getColumnsFromFormat(format: string): {
    list: string[];
    use12Hours: boolean;
};
export declare function scrollTo(element: HTMLElement, to: number, duration: number): void;
export declare function getFormattedValue(time: Dayjs, format: string): string;
export declare function getFormattedValue(time: Dayjs | undefined, format: string): string | undefined;
export declare function getFormattedValue(time: Array<Dayjs | undefined> | undefined, format: string): Array<string | undefined> | undefined;
export declare function isValidRangeValue(value: any): value is undefined | Dayjs[];
export declare function isValidInputValue(time: string, format: string): boolean;
export declare function isDisabledTime(value: Dayjs | undefined, { disabledHours, disabledMinutes, disabledSeconds, }: {
    disabledHours: TimePickerProps['disabledHours'];
    disabledMinutes: TimePickerProps['disabledMinutes'];
    disabledSeconds: TimePickerProps['disabledSeconds'];
}): boolean;
