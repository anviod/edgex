interface ControlBlockParams {
    value: [number, number];
    onChange: (value: [number, number]) => void;
}
export declare const useControlBlock: ({ value, onChange }: ControlBlockParams) => {
    active: import("vue").Ref<boolean, boolean>;
    blockRef: import("vue").Ref<HTMLDivElement | undefined, HTMLDivElement | undefined>;
    handlerRef: import("vue").Ref<HTMLDivElement | undefined, HTMLDivElement | undefined>;
    onMouseDown: (ev: MouseEvent) => void;
};
export {};
