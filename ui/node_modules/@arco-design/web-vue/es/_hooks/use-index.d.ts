import type { Ref } from 'vue';
export declare const useIndex: ({ itemRef, selector, index, parentClassName, }: {
    itemRef: Ref<HTMLElement | undefined>;
    selector: string;
    index?: Ref<number | undefined, number | undefined> | undefined;
    parentClassName?: string | undefined;
}) => {
    computedIndex: import("vue").ComputedRef<number>;
};
