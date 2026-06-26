export declare const hsvToRgb: (h: number, s: number, v: number) => {
    r: number;
    g: number;
    b: number;
};
export declare const rgbToHsv: (r: number, g: number, b: number) => {
    h: number;
    s: number;
    v: number;
};
export declare const parseIntFromHex: (val: string) => number;
export declare const convertHexToDecimal: (h: string) => number;
export declare const formatInputToRgb: (color: string) => {
    r: number;
    g: number;
    b: number;
    a?: number;
} | false;
export declare const formatInputToHSVA: (color: string) => {
    a: number;
    h: number;
    s: number;
    v: number;
};
export declare const hexToRgb: (color: string) => any;
export declare const rgbToHex: (r: number, g: number, b: number) => string;
export declare const rgbaToHex: (r: number, g: number, b: number, a: number) => string;
