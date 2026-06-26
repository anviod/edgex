import { InjectionKey } from 'vue';
import { GridItemData } from './interface';
export declare type RowContextContext = Readonly<{
    gutter?: [number, number];
    div?: boolean;
}>;
export declare const RowContextInjectionKey: InjectionKey<RowContextContext>;
export declare type GridContext = Readonly<{
    overflow: boolean;
    displayIndexList: number[];
    cols: number;
    colGap: number;
}>;
export declare const GridContextInjectionKey: InjectionKey<GridContext>;
export declare type GridDataCollector = Readonly<{
    collectItemData: (index: number, itemData: GridItemData) => void;
    removeItemData: (index: number) => void;
}>;
export declare const GridDataCollectorInjectionKey: InjectionKey<GridDataCollector>;
