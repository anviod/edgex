import { VirtualItemKey } from '../interface';
export declare function getIndexByStartLoc(min: number, max: number, start: number, index: number): number;
export declare function findListDiffIndex<T>(originList: T[], targetList: T[], getKey: (item: T, index: number) => VirtualItemKey): {
    index: number;
    multiple: boolean;
} | null;
