export declare function useViewportHeight(props: {
    height: number | string;
}): {
    viewportHeight: import("vue").Ref<number, number>;
    setViewportHeight: (val: number) => void;
    needMeasureViewportHeight: import("vue").ComputedRef<boolean>;
};
