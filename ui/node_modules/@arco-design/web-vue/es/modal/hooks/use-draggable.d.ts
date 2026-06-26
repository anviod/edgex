import { Ref } from 'vue';
export declare const useDraggable: ({ modalRef, wrapperRef, draggable, alignCenter, }: {
    modalRef: Ref<HTMLElement | undefined>;
    wrapperRef: Ref<HTMLElement | undefined>;
    draggable: Ref<boolean>;
    alignCenter: Ref<boolean>;
}) => {
    position: Ref<[number, number] | undefined, [number, number] | undefined>;
    handleMoveDown: (ev: MouseEvent) => void;
};
