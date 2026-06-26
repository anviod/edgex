import { Mode, FormatFunc, ValueFormat } from '../interface';
interface FormatProps {
    format?: string | FormatFunc;
    valueFormat?: ValueFormat;
    mode?: Mode;
    showTime?: boolean;
}
export declare function getDefaultFormat(mode?: Mode, showTime?: boolean): "gggg-wo" | "YYYY-MM-DD" | "YYYY-MM" | "YYYY" | "YYYY-[Q]Q" | "YYYY-MM-DD HH:mm:ss";
export declare function getDefaultValueFormat(mode?: Mode, showTime?: boolean): "YYYY-MM-DD" | "YYYY-MM" | "YYYY" | "YYYY-MM-DD HH:mm:ss";
export default function useFormat(props: FormatProps): {
    format: import("vue").ComputedRef<string>;
    valueFormat: import("vue").ComputedRef<string>;
    parseValueFormat: import("vue").ComputedRef<string>;
};
export {};
