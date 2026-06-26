import { Ref } from 'vue';
export declare const useResizeObserver: ({ elementRef, onResize, }: {
    elementRef: Ref<HTMLElement | undefined>;
    onResize: () => void;
}) => {
    createResizeObserver: () => void;
    destroyResizeObserver: () => void;
};
