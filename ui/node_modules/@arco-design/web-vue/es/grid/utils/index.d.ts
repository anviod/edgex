import { GridItemData } from '../interface';
export declare function resolveItemData(cols: number, props: GridItemData): GridItemData;
export declare function setItemVisible({ cols, collapsed, collapsedRows, itemDataList, }: {
    cols: number;
    collapsed: boolean;
    collapsedRows: number;
    itemDataList: GridItemData[];
}): {
    overflow: boolean;
    displayIndexList: number[];
};
