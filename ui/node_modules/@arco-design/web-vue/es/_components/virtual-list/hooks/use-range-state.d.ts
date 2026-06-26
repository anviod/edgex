export declare function useRangeState(props: {
    viewportRef: HTMLElement | undefined;
    visibleCount: number;
    itemCount: number;
}): {
    rangeState: {
        itemIndex: number;
        itemOffsetPtg: number;
        startIndex: number;
        endIndex: number;
    };
    updateRangeState: {
        (...args: any[]): void;
        cancel(): void;
    };
};
