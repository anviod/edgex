interface FormatProps {
    format?: string;
    defaultFormat?: string;
    use12Hours?: boolean;
}
export default function useTimeFormat(props: FormatProps): {
    columns: import("vue").ComputedRef<string[]>;
    use12Hours: import("vue").ComputedRef<boolean>;
    format: import("vue").ComputedRef<string>;
};
export {};
