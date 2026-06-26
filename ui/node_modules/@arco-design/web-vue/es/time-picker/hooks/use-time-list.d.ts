import { ComputedRef } from 'vue';
import { PanelProps, TimeList } from '../interface';
interface TimeListProps extends Pick<PanelProps, 'format' | 'step' | 'use12Hours' | 'disabledHours' | 'disabledMinutes' | 'disabledSeconds' | 'hideDisabledOptions'> {
    selectedHour: number | undefined;
    selectedMinute: number | undefined;
    selectedSecond: number | undefined;
    selectedAmpm: string;
    disabled?: boolean;
}
export default function useTimeList(props: TimeListProps): {
    hours: ComputedRef<TimeList>;
    minutes: ComputedRef<TimeList>;
    seconds: ComputedRef<TimeList>;
    ampmList: ComputedRef<TimeList>;
};
export {};
