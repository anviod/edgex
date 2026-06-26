import { Ref } from 'vue';
import { TableDraggable } from '../interface';
export declare const useDrag: (draggable: Ref<TableDraggable | undefined>) => {
    dragType: import("vue").ComputedRef<"row" | "handle" | undefined>;
    dragState: {
        dragging: boolean;
        sourceKey: string;
        sourcePath: number[];
        targetPath: number[];
        data: Record<string, unknown>;
    };
    handleDragStart: (ev: DragEvent, sourceKey: string, sourcePath: number[], data: Record<string, unknown>) => void;
    handleDragEnter: (ev: DragEvent, targetPath: number[]) => void;
    handleDragLeave: (ev: DragEvent) => void;
    handleDragover: (ev: DragEvent) => void;
    handleDragEnd: (ev: DragEvent) => void;
    handleDrop: (ev: DragEvent) => void;
};
