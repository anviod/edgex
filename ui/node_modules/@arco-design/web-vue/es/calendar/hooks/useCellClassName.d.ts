export default function useClassName({ prefixCls, mergedValue, rangeValues, hoverRangeValues, panel, isSameTime, innerMode, }: {
    prefixCls: any;
    mergedValue: any;
    rangeValues: any;
    hoverRangeValues: any;
    panel: any;
    isSameTime: any;
    innerMode: any;
}): (cellDateObj: any, disabled: any) => (string | {
    [x: string]: any;
})[];
