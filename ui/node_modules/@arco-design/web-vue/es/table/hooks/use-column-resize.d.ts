import { Ref } from 'vue';
import { EmitFn2 } from '../../_utils/types';
export declare const useColumnResize: (thRefs: Ref<Record<string, HTMLElement>>, emit: (event: "columnResize", dataIndex: string, width: number) => void) => {
    resizingColumn: Ref<string, string>;
    columnWidth: Record<string, number>;
    handleThMouseDown: (dataIndex: string, ev: MouseEvent) => void;
    handleThMouseUp: () => void;
};
