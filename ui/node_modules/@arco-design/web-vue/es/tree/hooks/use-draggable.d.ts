import { DropPosition, TreeNodeKey } from '../interface';
export default function useDraggable(props: {
    key: TreeNodeKey;
    refTitle: HTMLElement | undefined;
}): {
    isDragOver: import("vue").Ref<boolean, boolean>;
    isDragging: import("vue").Ref<boolean, boolean>;
    isAllowDrop: import("vue").Ref<boolean, boolean>;
    dropPosition: import("vue").Ref<DropPosition, DropPosition>;
    setDragStatus(status: 'dragStart' | 'dragOver' | 'dragLeave' | 'dragEnd' | 'drop', e: DragEvent): void;
};
