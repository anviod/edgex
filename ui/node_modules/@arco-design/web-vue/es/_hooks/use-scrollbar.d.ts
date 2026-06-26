import { Ref } from 'vue';
import { ScrollbarProps } from '../scrollbar';
export declare const useScrollbar: (scrollbar: Ref<ScrollbarProps | boolean>) => {
    displayScrollbar: import("vue").ComputedRef<boolean>;
    scrollbarProps: import("vue").ComputedRef<ScrollbarProps | undefined>;
};
