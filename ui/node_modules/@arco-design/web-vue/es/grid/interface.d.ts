export interface ResponsiveValue {
    xxl?: number;
    xl?: number;
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
}
export declare type FlexType = number | string | 'initial' | 'auto' | 'none';
export interface RowProps {
    gutter?: number | ResponsiveValue | ResponsiveValue[];
    justify?: 'start' | 'center' | 'end' | 'space-around' | 'space-between';
    align?: 'start' | 'center' | 'end' | 'stretch';
    div?: boolean;
    wrap?: boolean;
}
export interface ColProps {
    span?: number;
    offset?: number | undefined;
    order?: number | undefined;
    xs?: number | {
        [key: string]: any;
    } | undefined;
    sm?: number | {
        [key: string]: any;
    } | undefined;
    md?: number | {
        [key: string]: any;
    } | undefined;
    lg?: number | {
        [key: string]: any;
    } | undefined;
    xl?: number | {
        [key: string]: any;
    } | undefined;
    xxl?: number | {
        [key: string]: any;
    } | undefined;
    flex?: number | string | 'initial' | 'auto' | 'none' | undefined;
}
export interface GridProps {
    cols?: number | ResponsiveValue;
    rowGap?: number | ResponsiveValue;
    colGap?: number | ResponsiveValue;
    collapsed?: boolean;
    collapsedRows?: number;
}
export interface GridItemProps {
    span?: number | ResponsiveValue;
    offset?: number | ResponsiveValue;
    suffix?: boolean;
}
export interface GridItemData extends GridItemProps {
    span: number;
    offset: number;
}
