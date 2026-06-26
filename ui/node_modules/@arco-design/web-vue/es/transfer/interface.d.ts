export interface TransferItem {
    value: string;
    label: string;
    disabled: boolean;
}
export interface DataInfo {
    data: TransferItem[];
    allValidValues: string[];
    selected: string[];
    validSelected: string[];
}
