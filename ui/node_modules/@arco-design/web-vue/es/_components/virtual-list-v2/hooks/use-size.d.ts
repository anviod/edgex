import { Ref } from 'vue';
export declare const useSize: ({ dataKeys, contentRef, fixedSize, estimatedSize, buffer, }: {
    dataKeys: Ref<(string | number)[]>;
    contentRef: Ref<HTMLElement | undefined>;
    fixedSize: Ref<boolean>;
    estimatedSize: Ref<number | undefined>;
    buffer: Ref<number>;
}) => {
    frontPadding: import("vue").ComputedRef<number>;
    behindPadding: import("vue").ComputedRef<number>;
    start: Ref<number, number>;
    end: import("vue").ComputedRef<number>;
    getStartByScroll: (scrollOffset: number) => number;
    setItemSize: (key: string | number, size: number) => void;
    hasItemSize: (key: string | number) => boolean;
    setStart: (index: number) => void;
    getScrollOffset: (index: number) => number;
};
